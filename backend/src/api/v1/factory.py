from models.requests import StandstillRequest
from database.utils import get_db, get_factory_standstill_status
from fastapi import APIRouter, Depends, HTTPException

from sqlalchemy.orm import Session

router = APIRouter(prefix="/api/v1/factory")


@router.get("/standstill/{id_factory}")
def get_standstill(id_factory: int, db: Session = Depends(get_db)):
    try:
        result = get_factory_standstill_status(db, id_factory)
        if result is None:
            raise HTTPException(status_code=404, detail="Factory not found")
        return {"result": result}
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/standstill")
def get_standstill_(request: StandstillRequest, db: Session = Depends(get_db)):
    try:
        result = get_factory_standstill_status(db, request)
        if result is None:
            raise HTTPException(status_code=404, detail="Factory not found")
        return {"result": result}
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))
