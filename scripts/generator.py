from random import randint
from datetime import datetime
import asyncio
import json
from shared_data import *

async def rand_capacity(obj, pool):
        old = 3500
        i = 0
    #while True:
        minute = randint(5, 11)
        isGrow = [1,1,1,0,0,-1,-1,-1,0,0,-1,1,0,0]
        i += 1
        for _ in range(minute):
            generated_capacity = old + randint(50, 251) * isGrow[abs(i - int(obj["id_obj"])) % len(isGrow)] + randint(1, 20)
            
            if generated_capacity < 0:
                generated_capacity = 0
            old = generated_capacity
            if generated_capacity > obj["max_obj"]: 
                type_stc = "Krit"
            elif generated_capacity < obj["max_obj"] * obj["percent_obj"]: 
                type_stc = "Prost"
            else: 
                type_stc = "Norm"
            data = {
                "id_obj_stc": obj["id_obj"],
                "date_stc": str(datetime.now().date()),
                "time_stc": str(datetime.now().time()),
                "parameters": {
                    "power_stc": generated_capacity,
                    "type_stc": type_stc,
                    "max_obj": obj["max_obj"],
                    "percent_obj": float(obj["percent_obj"])
                }
            }

            # Сохраняем словарь в JSON-файл
            file_name = f"{JSON_PATH_}/obj_{obj['id_obj']}.json"
            with open(file_name, 'w') as json_file:
                json.dump(data, json_file, indent=4)

            #await asyncio.sleep(SLEEP_)  # Задержка между итерациями
