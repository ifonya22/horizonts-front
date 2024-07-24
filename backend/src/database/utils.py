from sqlalchemy import func

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
