from datetime import datetime

from database.utils import (
    get_all_firms_names,
    get_db,
    get_firm_critical_count,
    get_firm_critical_events,
    get_firm_equipment_downtime,
    get_firm_max_critical_power,
    get_firm_power_consumption,
    get_firm_working_time,
)
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from fastapi.logger import logger

router = APIRouter(prefix="/api/v1/firm")


@router.get("/{firm_id}")
def get_factory_day_info(firm_id: int, db: Session = Depends(get_db)):
    ans = {
        "work_time": get_firm_working_time(
            db, firm_id, datetime.now().strftime("%Y-%m-%d")
        ),
        "downtime": get_firm_equipment_downtime(
            db, firm_id, datetime.now().strftime("%Y-%m-%d")
        ),
        "critical_events": get_firm_critical_count(
            db, firm_id, datetime.now().strftime("%Y-%m-%d")
        ),
        "energy_consumption": get_firm_power_consumption(
            db, firm_id, datetime.now().strftime("%Y-%m-%d")
        ),
        "critical_power": get_firm_max_critical_power(
            db, firm_id, datetime.now().strftime("%Y-%m-%d")
        ),
    }
    return ans


@router.get("/{firm_id}/critical")
def get_factory_critical_day_info(firm_id: int, db: Session = Depends(get_db)):
    data = get_firm_critical_events(
        db, firm_id, datetime.now().strftime("%Y-%m-%d")
    )
    logger.warning(data)
    return data


@router.get("/get_all_factories/")
def get_all_factories(db: Session = Depends(get_db)):
    result = get_all_firms_names(db)
    return result
