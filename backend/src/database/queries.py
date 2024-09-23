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


def get_statistics_results(db, request):
    # sql = f"""
    # SELECT DATE_FORMAT(time_stc, '%H:%i') AS minute, SUM(power_stc) AS total_capacity
    # FROM statistics
    # WHERE date_stc = :date AND id_obj_stc = :firm_id
    # AND time_stc BETWEEN SUBTIME(CONVERT_TZ(NOW(), 'UTC', '{TIMEZONE}'), '02:00:00') AND CONVERT_TZ(NOW(), 'UTC', '{TIMEZONE}')
    # GROUP BY minute ORDER BY minute;
    # """
    sql = """
    SELECT DATE_FORMAT(time_stc, '%H:%i') AS minute, SUM(power_stc) AS total_capacity
    FROM statistics
    JOIN objects ON objects.id_obj = statistics.id_obj_stc
    JOIN workshops ON workshops.id = objects.workshop_id
    WHERE date_stc = :date AND workshops.firm_id = :firm_id
    AND time_stc BETWEEN SUBTIME(CONVERT_TZ(NOW(), 'UTC', 'Europe/Moscow'), '02:00:00') AND CONVERT_TZ(NOW(), 'UTC', 'Europe/Moscow')
    GROUP BY minute ORDER BY minute;
    """
    print(sql)
    result = db.execute(
        text(sql), {"firm_id": request.factory_id, "date": request.start_date}
    )

    return result


def get_statistics_prediction(db, request):
    # sql = f"""
    # SELECT DATE_FORMAT(time_pr, '%H:%i') AS minute, SUM(power_pr) AS total_capacity
    # FROM predictor
    # WHERE date_pr = :date AND id_obj_pr = :firm_id
    # AND time_pr BETWEEN SUBTIME(CONVERT_TZ(NOW(), 'UTC', '{TIMEZONE}'), '02:00:00') AND CONVERT_TZ(NOW(), 'UTC', '{TIMEZONE}')
    # GROUP BY minute ORDER BY minute;
    # """
    sql = f"""
    SELECT DATE_FORMAT(time_pr, '%H:%i') AS minute, SUM(power_pr) AS total_capacity
    FROM predictor
    JOIN objects ON objects.id_obj = predictor.id_obj_pr
    JOIN workshops ON workshops.id = objects.workshop_id
    WHERE predictor.date_pr = :date AND workshops.firm_id = :firm_id
    AND predictor.time_pr BETWEEN SUBTIME(CONVERT_TZ(NOW(), 'UTC', '{TIMEZONE}'), '02:00:00') AND CONVERT_TZ(NOW() + INTERVAL 10 MINUTE, 'UTC', '{TIMEZONE}')
    GROUP BY minute ORDER BY minute;
    """

    print(sql)
    result = db.execute(
        text(sql), {"firm_id": request.factory_id, "date": request.start_date}
    )

    return result


def get_firm_critical_count(db, firm_id, date):
    sql = f"""
    SELECT COUNT(*)
    FROM `status`
    WHERE
    type_stu = 'Krit'
        AND id_obj_stu = {firm_id}
        AND date_stu = '{date}';
    """
    result = db.execute(text(sql)).scalar()

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
    sql = """"""
    # result = db.execute(text(sql)).scalar()
    result = "in_progress"
    return result


def get_firm_equipment_downtime(db, firm_id, date):
    sql = """"""
    # result = db.execute(text(sql)).scalar()
    result = "in_progress"
    return result


def get_firm_critical_events(db, firm_id, date):
    sql = """
    SELECT start_stu, end_stu, is_notified_stu
    FROM status
    WHERE id_obj_stu = :firm_id
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


def get_all_firms_names(db):
    sql = """
    SELECT *
    FROM firm;
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
                    "id_workshop": admin.id_workshop
                }
                for admin in admins
            ],
            "employees": [
                {
                    "id": emlpoyee.id,
                    "full_name": emlpoyee.full_name,
                    "id_role": emlpoyee.id_role,
                    # "position": emlpoyee.position,
                    "id_workshop": emlpoyee.id_workshop
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


def add_new_workshop(db, workshop_num, workshop_name, workshop_id):
    sql = """
    INSERT INTO `workshops` (`id`, `num`, `name`, `firm_id`) VALUES (NULL, :workshop_num, :workshop_name, :firm_id);
    """
    result = db.execute(
        text(sql),
        {
            "workshop_num": int(workshop_num),
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


def get_equipments_list(db, workshop_id: int):
    sql = """
    SELECT id_obj FROM `objects` WHERE workshop_id = :workshop_id
    """
    equipments = db.execute(text(sql), {"workshop_id": workshop_id})
    equipment = [
        {
            "id": equip[0],
            "name": f"Оборудование {idx + 1}",
            "workTime": "6 часов",  # TODO: rand
            "idleTime": "1 час",  # TODO: rand
            "criticalEvents": 3,  # TODO: rand
            "assignedTime": "2 часа",  # TODO: rand
            "data": get_equipment_data_for_graphic(db, equip[0], "2024-09-23"),
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
