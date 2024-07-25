from datetime import datetime
import asyncio
import json
import os
from shared_data import *

async def input_data(obj, pool):
    # Формируем имя файла на основе id_obj
    file_name = f"obj_{obj['id_obj']}.json"
    file_path = os.path.join(JSON_PATH_, file_name)

    # Проверяем, что файл существует
    if not os.path.exists(file_path):
        print(f"Файл {file_name} не существует.")
        return  # Выход, если файл не найден

    try:
        # Открываем и читаем JSON-файл
        with open(file_path, 'r') as json_file:
            data = json.load(json_file)

        # Преобразуем дату и время из строк в объекты datetime.date и datetime.time
        date_stc = datetime.strptime(data["date_stc"], "%Y-%m-%d").date()
        time_stc = datetime.strptime(data["time_stc"], "%H:%M:%S.%f").time()

        async with pool.acquire() as connection:
            async with connection.cursor() as cursor:
                query = """INSERT INTO statistics (id_obj_stc, date_stc, time_stc, power_stc, type_stc) VALUES (%s, %s, %s, %s, %s)"""
                await cursor.execute(query, (data["id_obj_stc"], date_stc, time_stc, data["parameters"]["power_stc"], data["parameters"]["type_stc"]))
                await connection.commit()

        # Удаляем файл после успешного чтения и записи
        os.remove(file_path)

    except Exception as e:
        print(f"Не удалось прочитать или обработать файл {file_name}: {e}")
