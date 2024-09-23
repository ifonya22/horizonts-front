from datetime import datetime

from utils.utils import get_workshop_data, get_workshops_data
from models.requests import AddFirm
from database.queries import (
    add_new_equipment,
    add_new_firm,
    add_new_workshop,
    get_all_firms_names,
    get_db,
    get_firm_critical_count,
    get_firm_critical_events,
    get_firm_equipment_downtime,
    get_firm_max_critical_power,
    get_firm_power_consumption,
    get_firm_working_time,
    get_user_id_role,
)
from fastapi import APIRouter, Depends, Header
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
def get_all_factories(db: Session = Depends(get_db), username: str = Header(None)):
    _, id_role, id_workshop = get_user_id_role(db, username)
    result = get_all_firms_names(db, username, id_role)
    return result


@router.post("/add")
def add_firm(data: AddFirm, db: Session = Depends(get_db)):
    # TODO: добавить правильные поля
    firm_name = data.firmName
    workshops = data.workshops
    firm_id = add_new_firm(db, firm_name)
    for workshop in workshops:
        workshop_id = add_new_workshop(
            db, workshop.name, workshop.name, firm_id
        )
        for equip in workshop.equipment:
            res = add_new_equipment(db, 1, 0.3, workshop_id)

    return {"status": "ok"}


@router.delete("/{firm_id}")
def delete_firm(firm_id: int, db: Session = Depends(get_db)):
    pass
    return {"firm_id": firm_id}


@router.put("/{firm_id}")
def update_firm(firm_id: int, db: Session = Depends(get_db)):
    pass
    return {"firm_id": firm_id}


@router.get("/{firm_id}/{workshop_id}")
async def get_shop_info(
    firm_id: int, workshop_id: int, db: Session = Depends(get_db)
):
    # shop = next(
    #     (shop for shop in get_workshop_data(firm_id, workshop_id, db)),
    #     None,
    # )
    # if shop:
    return {
        "id": 11,
        "name": "test",
        "equipment": [
            shop for shop in get_workshop_data(firm_id, workshop_id, db)
        ],
    }

    return {"message": "Цех не найден"}, 404


@router.get("/{firm_id}/workshops/")
async def get_all_shops(
    firm_id: int, db: Session = Depends(get_db), username: str = Header(None)
):
    _, id_role, id_workshop = get_user_id_role(db, username)
    result = get_workshops_data(firm_id, db, id_role, id_workshop)
    return result
