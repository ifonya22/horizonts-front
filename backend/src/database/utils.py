from sqlalchemy import func, text

from database.database import SessionLocal
from database.models import Statistic


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_statistics_results(db, request):
    results = (
        db.query(
            func.date_format(Statistic.time_, "%H:%i").label("minute"),
            func.sum(Statistic.capacity).label("total_capacity"),
        )
        .filter(
            Statistic.date_ == request.start_date,  # "2024-05-18"
            Statistic.time_.between(
                func.subtime(func.curtime(), "01:00:00"), func.curtime()
            ),
        )
        .group_by("minute")
        .order_by("minute")
        .all()
    )

    return results


def get_factory_standstill_status(db, factory_id):
    sql = f"""
    SELECT SUM(TIMESTAMPDIFF(SECOND, CONCAT(s.date_status, ' ', s.time_begin),
    CONCAT(s.date_status, ' ', s.time_end))) / 3600 AS
    total_simple_status_time_hours
    FROM status AS s JOIN phider AS p ON s.id_phider = p.id_phider
    JOIN workshop_phider AS wp ON p.id_phider = wp.id_phider
    JOIN factory AS f ON wp.id_factory = f.id_factory
    WHERE s.type_status = 'Простой' AND f.id_factory = {factory_id};"""
    result = db.execute(text(sql)).scalar()

    return result


def get_phider_standstill_minutes(db, phider_id):
    sql = f"""
    SELECT SUM(TIMESTAMPDIFF(MINUTE, status.time_begin, status.time_end))
    AS sum FROM status WHERE status.type_status IN ('Простой')
    AND status.time_end >= \"2024-05-18 00:03:00\" - INTERVAL 24 HOUR
    AND status.id_phider = {phider_id};
    """
    result = db.execute(text(sql)).scalar()

    return result


def get_phider_work_minutes(db, phider_id):
    sql = f"""
    SELECT SUM(TIMESTAMPDIFF(MINUTE, status.time_begin, status.time_end))
    AS \"sum\"
    FROM status WHERE status.type_status IN ('Критический', ' ')
    AND status.time_end >= \"2024-05-18 00:03:00\" - INTERVAL 24 HOUR
    AND status.id_phider = \"+{phider_id}\";
    """
    result = db.execute(text(sql)).scalar()

    return result
