from datetime import datetime

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


example_data = {
    "shops": [
        {
            "id": 1,
            "name": "Цех 1",
            "equipment": [
                {
                    "id": 1,
                    "name": "Оборудование 1",
                    "workTime": "5 часов",
                    "idleTime": "3 часа 15 минут",
                    "criticalEvents": 4,
                    "assignedTime": "2 часа",
                    "data": [
                        {"time": "2024-08-10 10:00", "value": 50},
                        {"time": "2024-08-10 11:00", "value": 55},
                    ],
                },
                {
                    "id": 2,
                    "name": "Оборудование 2",
                    "workTime": "4 часа",
                    "idleTime": "2 часа",
                    "criticalEvents": 2,
                    "assignedTime": "1 час",
                    "data": [
                        {"time": "2024-08-10 10:00", "value": 60},
                        {"time": "2024-08-10 11:00", "value": 65},
                        {"time": "2024-08-10 12:00", "value": 63},
                    ],
                },
            ],
        },
        {
            "id": 2,
            "name": "Цех 2",
            "equipment": [
                {
                    "id": 3,
                    "name": "Оборудование 3",
                    "workTime": "6 часов",
                    "idleTime": "1 час",
                    "criticalEvents": 3,
                    "assignedTime": "2 часа",
                    "data": [
                        {"time": "2024-08-10 10:00", "value": 70},
                        {"time": "2024-08-10 11:00", "value": 75},
                    ],
                }
            ],
        },
    ]
}


@router.get("/{firm_id}/{workshop_id}")
async def get_shop_info(firm_id: int, workshop_id: int):
    shop = next(
        (shop for shop in example_data["shops"] if shop["id"] == workshop_id),
        None,
    )
    if shop:
        return shop
    return {"message": "Цех не найден"}, 404


@router.get("/{firm_id}/workshops/")
async def get_all_shops(firm_id: int):
    return example_data
