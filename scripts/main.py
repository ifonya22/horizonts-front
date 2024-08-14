import aiomysql
import asyncio
from shared_data import USER_, PASSWORD_, HOST_, PORT_, DB_, SLEEP_
from status import status
from generator import rand_capacity
from input import input_data
from predictor import predict_capacity

async def main():
    while True:
        try:
            pool = await aiomysql.create_pool(user=USER_, password=PASSWORD_, host=HOST_, port=PORT_, db=DB_)
            async with pool.acquire() as connection:
                async with connection.cursor(aiomysql.DictCursor) as cursor:
                    try:
                        await cursor.execute('SELECT * FROM objects')
                        objects = await cursor.fetchall()
                    except aiomysql.Error as error:
                        print("Ошибка при работе с objects", error)
                        return

            for obj in objects:
                await rand_capacity(obj, pool)  # Ждем завершения rand_capacity
                await input_data(obj, pool)     # Ждем завершения input_data
                asyncio.create_task(status(obj, pool))  # Запускаем status параллельно

                # Прогнозируем мощность на следующие 30 минут и сохраняем в базу данных
                await predict_capacity(obj, pool)

            # Параллельный запуск sleep
            await asyncio.sleep(SLEEP_)  # Ждем завершения sleep

        except Exception as e:
            print(f"Ошибка в основном цикле: {e}")
        
        finally:
            pool.close()  # Закрываем пул
            await pool.wait_closed()  # Ждем завершения

asyncio.run(main())
