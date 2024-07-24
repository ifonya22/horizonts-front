from database.utils import get_db
from fastapi import APIRouter, Depends

from sqlalchemy.orm import Session

router = APIRouter(prefix="/api/v1/factory")


@router.get("/{id_factory}")
def get_statistics_orm(id_factory: int, db: Session = Depends(get_db)):
    pass
