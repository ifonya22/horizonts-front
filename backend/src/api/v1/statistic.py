from functools import wraps
from database.queries import (
    get_db,
    get_statistics_results,
    get_statistics_prediction,
    get_user_id_role,
)
from fastapi import APIRouter, Depends, Header
from models.requests import StatisticRequest
from models.responses import StatisticResponse
from sqlalchemy.orm import Session

router = APIRouter(prefix="/api/v1/statistic")

# def username_required(func):
#     @wraps(func)
#     async def wrapper(*args, db: Session = Depends(get_db), username: str = Header(None), **kwargs):
#         username = get_user_id_role(db, username)
#         return await func(*args, username=username, **kwargs)
#     return wrapper


@router.post("/last_hour", response_model=StatisticResponse)
def get_statistics_orm(
    request: StatisticRequest,
    db: Session = Depends(get_db),
    username: str = Header(None),
):
    _, id_role, _ = get_user_id_role(db, username)

    results = get_statistics_results(db, request, id_role)
    predictions = get_statistics_prediction(db, request, id_role)
    return {
        "last_hour": [
            {
                "minute": result.minute,
                "total_capacity": result.total_capacity,
            }
            for result in results
        ],
        "prediction": [
            {
                "minute": prediction.minute,
                "total_capacity": prediction.total_capacity,
            }
            for prediction in predictions
        ],
    }
