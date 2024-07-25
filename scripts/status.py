import aiomysql
import asyncio
from shared_data import SLEEP_

async def status(obj, pool):
    #while True:
        async with pool.acquire() as connection:
            async with connection.cursor(aiomysql.DictCursor) as cursor:
                try:
                    # Получаем данные из STATISTICS
                    await cursor.execute(
                        f'SELECT * FROM statistics WHERE date_stc = CURDATE() '
                        f'AND id_obj_stc = {obj["id_obj"]} '
                        'ORDER BY id_stc DESC'
                    )
                    stc = await cursor.fetchone()
                    if not stc:
                        raise  aiomysql.Error("stc - пуст")
                    
                    # Получаем данные из status
                    await cursor.execute(
                        f'SELECT * FROM status WHERE date_stu = CURDATE() AND id_obj_stu = {obj["id_obj"]} ORDER BY id_stu DESC'
                    )
                    stu = await cursor.fetchone()
                    
                    # Вставляем или обновляем status
                    if not stu :
                        await cursor.execute(
                            "INSERT INTO status (date_stu, start_stu, end_stu, id_obj_stu, type_stu, is_notified_stu) "
                            "VALUES (CURDATE(), %s, %s, %s, %s, TRUE)",
                            (stc["time_stc"], stc["time_stc"], stc["id_obj_stc"], stc["type_stc"])
                        )
                    elif stu["type_stu"] == stc["type_stc"]:
                        await cursor.execute(
                            "UPDATE status SET end_stu = %s WHERE id_stu = %s",
                            (stc["time_stc"], stu["id_stu"])
                        )
                    elif stu["type_stu"] != stc["type_stc"]:
                        await cursor.execute(
                            "UPDATE status SET end_stu = %s WHERE id_stu = %s",
                            (stc["time_stc"], stu["id_stu"])
                        )
                        await connection.commit()
                        await cursor.execute(
                            "INSERT INTO status (date_stu, start_stu, end_stu, id_obj_stu, type_stu, is_notified_stu) "
                            "VALUES (CURDATE(), %s, %s, %s, %s, TRUE)",
                            (stc["time_stc"], stc["time_stc"], stc["id_obj_stc"], stc["type_stc"])
                        )
                    await connection.commit()  # Сохраняем изменения

                except aiomysql.Error as error:
                    print("Ошибка при работе с status", error)
                    return
        #await asyncio.sleep(SLEEP_)
