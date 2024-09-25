from datetime import datetime, timedelta
import os
from sqlalchemy import text

from database.database import SessionLocal


TIMEZONE = os.environ.get("TIMEZONE")  # Europe/Moscow


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_statistics_results(db, request, id_role):
    # sql = f"""
    # SELECT DATE_FORMAT(time_stc, '%H:%i') AS minute, SUM(power_stc) AS total_capacity
    # FROM statistics
    # WHERE date_stc = :date AND id_obj_stc = :firm_id
    # AND time_stc BETWEEN SUBTIME(CONVERT_TZ(NOW(), 'UTC', '{TIMEZONE}'), '02:00:00') AND CONVERT_TZ(NOW(), 'UTC', '{TIMEZONE}')
    # GROUP BY minute ORDER BY minute;
    # """
    sql = None

    if id_role == 1:
        sql = """
        SELECT DATE_FORMAT(time_stc, '%H:%i') AS minute, SUM(power_stc) AS total_capacity
        FROM statistics
        JOIN objects ON objects.id_obj = statistics.id_obj_stc
        JOIN workshops ON workshops.id = objects.workshop_id
        WHERE date_stc = :date AND workshops.firm_id = :firm_id
        AND time_stc BETWEEN SUBTIME(CONVERT_TZ(NOW(), 'UTC', 'Europe/Moscow'), '02:00:00') AND CONVERT_TZ(NOW(), 'UTC', 'Europe/Moscow')
        GROUP BY minute ORDER BY minute;
        """
    elif id_role == 2:
        sql = """
        SELECT DATE_FORMAT(time_stc, '%H:%i') AS minute, SUM(power_stc) AS total_capacity
        FROM statistics
        JOIN objects ON objects.id_obj = statistics.id_obj_stc
        JOIN workshops ON workshops.id = objects.workshop_id
        WHERE date_stc = :date AND workshops.firm_id = :firm_id
        AND time_stc BETWEEN SUBTIME(CONVERT_TZ(NOW(), 'UTC', 'Europe/Moscow'), '02:00:00') AND CONVERT_TZ(NOW(), 'UTC', 'Europe/Moscow')
        GROUP BY minute ORDER BY minute;
        """
    elif id_role == 3:
        sql = """
        SELECT DATE_FORMAT(time_stc, '%H:%i') AS minute, SUM(power_stc) AS total_capacity
        FROM statistics
        JOIN objects ON objects.id_obj = statistics.id_obj_stc
        WHERE date_stc = :date AND objects.workshop_id = :firm_id
        AND time_stc BETWEEN SUBTIME(CONVERT_TZ(NOW(), 'UTC', 'Europe/Moscow'), '02:00:00') AND CONVERT_TZ(NOW(), 'UTC', 'Europe/Moscow')
        GROUP BY minute ORDER BY minute;
        """

    if sql:
        result = db.execute(
            text(sql),
            {"firm_id": request.factory_id, "date": request.start_date},
        )

        return result

    return None


def get_statistics_prediction(db, request, id_role):
    # sql = f"""
    # SELECT DATE_FORMAT(time_pr, '%H:%i') AS minute, SUM(power_pr) AS total_capacity
    # FROM predictor
    # WHERE date_pr = :date AND id_obj_pr = :firm_id
    # AND time_pr BETWEEN SUBTIME(CONVERT_TZ(NOW(), 'UTC', '{TIMEZONE}'), '02:00:00') AND CONVERT_TZ(NOW(), 'UTC', '{TIMEZONE}')
    # GROUP BY minute ORDER BY minute;
    # """
    sql = None

    if id_role in [1, 2]:
        sql = f"""
        SELECT DATE_FORMAT(time_pr, '%H:%i') AS minute, SUM(power_pr) AS total_capacity
        FROM predictor
        JOIN objects ON objects.id_obj = predictor.id_obj_pr
        JOIN workshops ON workshops.id = objects.workshop_id
        WHERE predictor.date_pr = :date AND workshops.firm_id = :firm_id
        AND predictor.time_pr BETWEEN SUBTIME(CONVERT_TZ(NOW(), 'UTC', '{TIMEZONE}'), '02:00:00') AND CONVERT_TZ(NOW() + INTERVAL 10 MINUTE, 'UTC', '{TIMEZONE}')
        GROUP BY minute ORDER BY minute;
        """
    elif id_role == 3:
        sql = f"""
        SELECT DATE_FORMAT(time_pr, '%H:%i') AS minute, SUM(power_pr) AS total_capacity
        FROM predictor
        JOIN objects ON objects.id_obj = predictor.id_obj_pr
        WHERE predictor.date_pr = :date AND objects.workshop_id = :firm_id
        AND predictor.time_pr BETWEEN SUBTIME(CONVERT_TZ(NOW(), 'UTC', '{TIMEZONE}'), '02:00:00') AND CONVERT_TZ(NOW() + INTERVAL 10 MINUTE, 'UTC', '{TIMEZONE}')
        GROUP BY minute ORDER BY minute;
        """

    # print(sql)
    if sql:
        result = db.execute(
            text(sql),
            {"firm_id": request.factory_id, "date": request.start_date},
        )

    return result


def get_firm_critical_count(db, firm_id, date):
    sql = """
    SELECT COUNT(*)
    FROM `status`
    JOIN objects ON objects.id_obj = status.id_obj_stu
    JOIN workshops ON workshops.id = objects.workshop_id
    JOIN firm ON firm.id_f = workshops.firm_id
    WHERE
    type_stu = 'Krit'
    AND firm.id_f = :firm_id
        AND date_stu = :date;

    """
    result = db.execute(text(sql), {"firm_id": firm_id, "date": date}).scalar()

    return result


def get_firm_max_critical_power(db, firm_id, date):
    sql = f"""
    SELECT MAX(power_stc)
    FROM `statistics`
    WHERE
        id_obj_stc = {firm_id}
        AND date_stc = '{date}';
    """
    result = db.execute(text(sql)).scalar()

    return result


def get_firm_power_consumption(db, firm_id, date):
    sql = f"""
    SELECT SUM(power_stc)/COUNT(*)
    FROM `statistics`
    WHERE
    id_obj_stc = {firm_id}
    AND date_stc = '{date}';
    """
    result = db.execute(text(sql)).scalar()

    return result


def get_firm_working_time(db, firm_id, date):
    sql = """
    SELECT 
        FLOOR(SUM(CASE 
            WHEN TIME_TO_SEC(TIMEDIFF(end_stu, start_stu)) = 0 
            THEN 60  -- добавляем 1 минуту (60 секунд), если разница 0
            ELSE TIME_TO_SEC(TIMEDIFF(end_stu, start_stu)) 
        END) / 3600) AS hours,
        
        FLOOR((SUM(CASE 
            WHEN TIME_TO_SEC(TIMEDIFF(end_stu, start_stu)) = 0 
            THEN 60  -- добавляем 1 минуту (60 секунд), если разница 0
            ELSE TIME_TO_SEC(TIMEDIFF(end_stu, start_stu)) 
        END) % 3600) / 60) AS minutes
    FROM status
    JOIN objects ON objects.id_obj = status.id_obj_stu
    JOIN workshops ON workshops.id = objects.workshop_id
    JOIN firm ON firm.id_f = workshops.firm_id
    WHERE type_stu = 'Norm' AND firm.id_f = :firm_id AND date_stu = :date;
    """
    data = db.execute(text(sql), {"firm_id": firm_id, "date": date}).fetchall()
    hours, minutes = data[0]

    if hours:
        return f"{hours} ч. {minutes} мин."
    elif minutes:
        return f"{minutes} мин."
    else:
        return "0 мин."


def get_firm_equipment_downtime(db, firm_id, date):
    sql = """
    SELECT 
        FLOOR(SUM(CASE 
            WHEN TIME_TO_SEC(TIMEDIFF(end_stu, start_stu)) = 0 
            THEN 60  -- добавляем 1 минуту (60 секунд), если разница 0
            ELSE TIME_TO_SEC(TIMEDIFF(end_stu, start_stu)) 
        END) / 3600) AS hours,
        
        FLOOR((SUM(CASE 
            WHEN TIME_TO_SEC(TIMEDIFF(end_stu, start_stu)) = 0 
            THEN 60  -- добавляем 1 минуту (60 секунд), если разница 0
            ELSE TIME_TO_SEC(TIMEDIFF(end_stu, start_stu)) 
        END) % 3600) / 60) AS minutes
    FROM status
    JOIN objects ON objects.id_obj = status.id_obj_stu
    JOIN workshops ON workshops.id = objects.workshop_id
    JOIN firm ON firm.id_f = workshops.firm_id
    WHERE type_stu = 'Prost' AND firm.id_f = :firm_id AND date_stu = :date;
    """
    data = db.execute(text(sql), {"firm_id": firm_id, "date": date}).fetchall()
    hours, minutes = data[0]

    if hours:
        return f"{hours} ч. {minutes} мин."
    elif minutes:
        return f"{minutes} мин."
    else:
        return "0 мин."


def get_firm_critical_events(db, firm_id, date):
    sql = """
    SELECT start_stu, end_stu, is_notified_stu
    FROM status
    JOIN objects ON objects.id_obj = status.id_obj_stu
    JOIN workshops ON workshops.id = objects.workshop_id
    JOIN firm ON firm.id_f = workshops.firm_id
    WHERE firm.id_f = :firm_id
        AND date_stu = :date
        AND type_stu = 'Krit';
    """

    result = db.execute(text(sql), {"firm_id": firm_id, "date": date})

    column_names = [column[0] for column in result.cursor.description]

    data_dict = {column: [] for column in column_names}

    for row in result.fetchall():
        for column, value in zip(column_names, row):
            if isinstance(value, datetime):
                data_dict[column].append(value.strftime("%H:%M:%S"))
            elif isinstance(value, timedelta):
                total_seconds = int(value.total_seconds())
                hours, remainder = divmod(total_seconds, 3600)
                minutes, seconds = divmod(remainder, 60)
                formatted_duration = f"{hours:02}:{minutes:02}:{seconds:02}"
                data_dict[column].append(formatted_duration)
            else:
                data_dict[column].append(value)

    return data_dict


def get_all_firms_names(db, username, id_role):
    if id_role in [2, 3]:
        sql = """
        SELECT firm.id_f, firm.short_f, firm.long_f
        FROM firm
        JOIN workshops ON workshops.firm_id = firm.id_f
        JOIN users ON users.id_workshop = workshops.id
        WHERE users.username = :username

        """
        result = db.execute(text(sql), {"username": username})
    elif id_role == 1:
        sql = """
            SELECT *
            FROM firm
        """
        result = db.execute(text(sql))

    column_names = [column[0] for column in result.cursor.description]
    data_dict = {column: [] for column in column_names}
    for row in result.fetchall():
        for column, value in zip(column_names, row):
            data_dict[column].append(value)

    return data_dict


def get_users(db):
    sql = """
    SELECT * FROM `users` WHERE id_role = 1
    """
    admins = db.execute(text(sql))
    sql = """
    SELECT * FROM `users` WHERE id_role = 0
    """
    employees = db.execute(text(sql))

    return {
        "users": {
            "admins": [
                {
                    "id": admin.id,
                    "full_name": admin.full_name,
                    "id_role": admin.id_role,
                    # "position": admin.position,
                    "id_workshop": admin.id_workshop,
                }
                for admin in admins
            ],
            "employees": [
                {
                    "id": emlpoyee.id,
                    "full_name": emlpoyee.full_name,
                    "id_role": emlpoyee.id_role,
                    # "position": emlpoyee.position,
                    "id_workshop": emlpoyee.id_workshop,
                }
                for emlpoyee in employees
            ],
        }
    }


def add_new_firm(db, firm_name):
    sql = """
    INSERT INTO `firm` (`id_f`, `short_f`, `long_f`) VALUES (NULL, :firm_short_name, :firm_long_name);
    """
    result = db.execute(
        text(sql), {"firm_short_name": firm_name, "firm_long_name": firm_name}
    )
    db.commit()

    firm_id = result.lastrowid
    return firm_id


def add_new_workshop(db, workshop_name, workshop_id):
    sql = """
    INSERT INTO `workshops` (`id`, `name`, `firm_id`) VALUES (NULL, :workshop_name, :firm_id);
    """
    result = db.execute(
        text(sql),
        {
            "workshop_name": workshop_name,
            "firm_id": workshop_id,
        },
    )
    db.commit()

    workshop_id = result.lastrowid
    return workshop_id


def add_new_equipment(db, max_obj, percent_obj, workshop_id):
    sql = """
    INSERT INTO `objects` (`id_obj`, `max_obj`, `percent_obj`, `workshop_id`) VALUES (NULL, :max_obj, :percent_obj, :workshop_id);
    """
    result = db.execute(
        text(sql),
        {
            "max_obj": max_obj,
            "percent_obj": percent_obj,
            "workshop_id": workshop_id,
        },
    )
    db.commit()

    equipment_id = result.lastrowid
    return equipment_id


def get_workshops_list(db, firm_id: int):
    sql = """
    SELECT * FROM `workshops` WHERE firm_id = :firm_id
    """
    workshops = db.execute(text(sql), {"firm_id": firm_id})
    return workshops


def get_equipments_list_by_workshop_id(db, workshop_id: int):
    sql = """
    SELECT * FROM `objects` WHERE workshop_id = :workshop_id
    """
    equipments = db.execute(text(sql), {"workshop_id": workshop_id})
    return equipments


def get_workshop_by_workshop_id(db, workshop_id: int):
    sql = """
    SELECT objects.id_obj, workshops.name
    FROM `objects` 
    JOIN workshops ON workshops.id = objects.workshop_id
    WHERE workshop_id = :workshop_id
    """
    workshops = db.execute(text(sql), {"workshop_id": workshop_id}).fetchall()
    return workshops


def get_equipments_list(db, workshop_id: int):
    sql = """
    SELECT id_obj FROM `objects` WHERE workshop_id = :workshop_id
    """
    equipments = db.execute(text(sql), {"workshop_id": workshop_id})
    equipment = [
        {
            "id": equip[0],
            "name": f"Оборудование {idx + 1}",
            "workTime": get_work_time_by_obj_id(db, equip[0], "Norm"),
            "idleTime": get_work_time_by_obj_id(db, equip[0], "Prost"),
            "criticalEvents": get_ctitical_count_events(db, equip[0]),
            "data": get_equipment_data_for_graphic(
                db, equip[0], datetime.today().strftime("%Y-%m-%d")
            ),
        }
        for idx, equip in enumerate(equipments)
    ]
    return equipment


def get_equipment_data_for_graphic(db, equipment_id: int, date_stc):
    sql = """
    SELECT DATE_FORMAT(time_stc, '%H:%i') AS minute, SUM(power_stc) AS total_capacity
    FROM statistics
    WHERE statistics.date_stc = :date_stc AND statistics.id_obj_stc = :equipment_id
    AND statistics.time_stc BETWEEN SUBTIME(CONVERT_TZ(NOW(), 'UTC', 'Europe/Moscow'), '02:00:00') 
    AND CONVERT_TZ(NOW(), 'UTC', 'Europe/Moscow')
    GROUP BY minute ORDER BY minute;
    """
    data = db.execute(
        text(sql), {"equipment_id": int(equipment_id), "date_stc": date_stc}
    )

    data = [{"time": equip[0], "value": equip[1]} for equip in data.fetchall()]
    return data


from fastapi.logger import logger


def get_user_id_role(db, username: str):
    sql = """
    SELECT username, id_role, id_workshop FROM `users` WHERE username = :username
    """
    data = db.execute(text(sql), {"username": username}).fetchall()

    logger.warning(f"aaaaaaaaaaaaaaaaaaaaaaaaaaaac {username, data}")
    # if not data:
    #     raise HTTPException(status_code=404, detail="User not found")

    return data[0][0], int(data[0][1]), int(data[0][2])


def get_work_time_by_obj_id(db, obj_id, type_stu):
    sql = f"""
    SELECT 
        FLOOR(SUM(CASE 
            WHEN TIME_TO_SEC(TIMEDIFF(end_stu, start_stu)) = 0 
            THEN 60  -- добавляем 1 минуту (60 секунд), если разница 0
            ELSE TIME_TO_SEC(TIMEDIFF(end_stu, start_stu)) 
        END) / 3600) AS hours,
        
        FLOOR((SUM(CASE 
            WHEN TIME_TO_SEC(TIMEDIFF(end_stu, start_stu)) = 0 
            THEN 60  -- добавляем 1 минуту (60 секунд), если разница 0
            ELSE TIME_TO_SEC(TIMEDIFF(end_stu, start_stu)) 
        END) % 3600) / 60) AS minutes
    FROM status
    WHERE type_stu = '{type_stu}' AND id_obj_stu = :obj_id AND date_stu = :date;
    """
    data = db.execute(
        text(sql),
        {"obj_id": obj_id, "date": datetime.today().strftime("%Y-%m-%d")},
    ).fetchall()
    hours, minutes = data[0]

    if hours:
        return f"{hours} ч. {minutes} мин."
    elif minutes:
        return f"{minutes} мин."
    else:
        return "0 мин."


def get_critical_events_list(db, obj_id):
    sql = """
    SELECT start_stu, end_stu, type_stu
    FROM `status` 
    WHERE id_obj_stu = :obj_id
    AND date_stu = :date 
        AND (type_stu = "Krit" OR type_stu = "Prost");
    """
    data = db.execute(
        text(sql),
        {"obj_id": obj_id, "date": datetime.today().strftime("%Y-%m-%d")},
    ).fetchall()
    # logger.warning(data)

    return [data]


def get_ctitical_count_events(db, obj_id):
    sql = """
    SELECT COUNT(*)
    FROM `status`
    WHERE
    type_stu = 'Krit'
        AND id_obj_stu = :obj_id
        AND date_stu = :date;
    """
    data = db.execute(
        text(sql),
        {"obj_id": obj_id, "date": datetime.today().strftime("%Y-%m-%d")},
    ).fetchall()

    return int(data[0][0])


def get_history_sql(
    db,
    objects: list[int],
    date_start: str,
    time_start: str,
    date_end: str,
    time_end: str,
):
    placeholders = ', '.join([f":obj_{i}" for i in range(len(objects))])
    sql = """
    SELECT workshops.name, date_stc, TIME_FORMAT(statistics.time_stc, '%H:%i:%s') AS time_stc, power_stc, id_obj_stc, type_stc
    FROM statistics
    JOIN objects ON objects.id_obj = statistics.id_obj_stc
    JOIN workshops ON workshops.id = objects.workshop_id
    WHERE id_obj_stc IN :objects
    AND date_stc BETWEEN :date_start AND :date_end
    AND time_stc BETWEEN "00:00:00" AND "23:59:59"
    """

    

    sql = sql.replace(':objects', f'({placeholders})')

    params = {
        "date_start": date_start,
        "time_start": time_start,
        "date_end": date_end,
        "time_end": time_end,
    }

    for i, obj in enumerate(objects):
        params[f'obj_{i}'] = obj

    data = db.execute(
        text(sql),
        params,
    ).fetchall()
    logger.warning(f"qaqedqwdqweqd {data}")
    return data
