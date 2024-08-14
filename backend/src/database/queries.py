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
    sql = f"""
    SELECT DATE_FORMAT(time_stc, '%H:%i') AS minute, SUM(power_stc) AS total_capacity
    FROM statistics
    WHERE date_stc = :date AND id_obj_stc = :firm_id
    AND time_stc BETWEEN SUBTIME(CONVERT_TZ(NOW(), 'UTC', '{TIMEZONE}'), '02:00:00') AND CONVERT_TZ(NOW(), 'UTC', '{TIMEZONE}')
    GROUP BY minute ORDER BY minute;
    """

    print(sql)
    result = db.execute(
        text(sql), {"firm_id": request.factory_id, "date": request.start_date}
    )

    return result


def get_statistics_prediction(db, request):
    sql = f"""
    SELECT DATE_FORMAT(time_pr, '%H:%i') AS minute, SUM(power_pr) AS total_capacity
    FROM predictor
    WHERE date_pr = :date AND id_obj_pr = :firm_id
    AND time_pr BETWEEN SUBTIME(CONVERT_TZ(NOW(), 'UTC', '{TIMEZONE}'), '02:00:00') AND CONVERT_TZ(NOW(), 'UTC', '{TIMEZONE}')
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
