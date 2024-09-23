from database.queries import get_equipments_list, get_workshops_list


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

from fastapi.logger import logger


def get_workshops_data(firm_id: int, db):
    data = {"shops": []}

    for workshop in get_workshops_list(db, firm_id=firm_id):

        data["shops"].append(
            {
                "id": workshop[0],
                "name": workshop[1],
                "equipment": [
                    {
                        "id": equip["id"],
                        "name": equip["name"],
                        "workTime": equip["workTime"],
                        "idleTime": equip["idleTime"],
                        "criticalEvents": equip["criticalEvents"],
                        "assignedTime": equip["assignedTime"],
                        "data": equip["data"],
                    }
                    for equip in get_equipments_list(
                        db, workshop_id=workshop[0]
                    )
                ],
            }
        )

    return data


def get_workshop_data(firm_id: int, workshop_id: int, db):
    res = get_equipments_list(db, workshop_id=workshop_id)
    logger.warning(res)
    return res
