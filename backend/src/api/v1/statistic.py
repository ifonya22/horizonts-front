from database.queries import get_db, get_statistics_results, get_statistics_prediction
from fastapi import APIRouter, Depends
from models.requests import StatisticRequest
from models.responses import StatisticResponse
from sqlalchemy.orm import Session

router = APIRouter(prefix="/api/v1/statistic")


@router.post("/last_hour", response_model=StatisticResponse)
def get_statistics_orm(request: StatisticRequest, db: Session = Depends(get_db)):
    results = get_statistics_results(db, request)
    predictions = get_statistics_prediction(db, request)
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
