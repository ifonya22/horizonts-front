from database.utils import (
    get_db,
    get_phider_standstill_minutes,
    get_phider_work_minutes,
)
from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session

router = APIRouter(prefix="/api/v1/phider")


@router.get("/{phider_id}/standstill")
def get_phider_standstill(phider_id: int, db: Session = Depends(get_db)):
    try:
        result = get_phider_standstill_minutes(db, phider_id)
        if result is None:
            raise HTTPException(status_code=404, detail="Phider not found")
        return {"result": result}
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.get("/{phider_id}/work")
def get_phider_work(phider_id: int, db: Session = Depends(get_db)):
    try:
        result = get_phider_work_minutes(db, phider_id)
        if result is None:
            raise HTTPException(status_code=404, detail="Phider not found")
        return {"result": result}
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
