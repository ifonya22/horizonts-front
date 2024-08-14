from datetime import datetime, timedelta, time
import asyncio
import numpy as np
from sklearn.linear_model import LinearRegression
from shared_data import *

async def collect_data(obj, pool, minutes):
    async with pool.acquire() as connection:
        async with connection.cursor() as cursor:
            end_time = datetime.now()
            start_time = end_time - timedelta(minutes=minutes)
            query = """SELECT date_stc, time_stc, power_stc FROM statistics
                       WHERE id_obj_stc = %s AND CONCAT(date_stc, ' ', time_stc) BETWEEN %s AND %s
                       ORDER BY date_stc, time_stc"""
            await cursor.execute(query, (obj['id_obj'], start_time, end_time))
            records = await cursor.fetchall()

            # Преобразуем данные для дальнейшего использования
            data = []
            for record in records:
                date_stc = record[0]  # datetime.date
                time_stc = record[1]  # datetime.timedelta
                power_stc = record[2]  # int

                # Преобразуем timedelta в объект datetime.time
                time_pr = seconds_to_time(time_stc.total_seconds())
                
                # Создаем объект datetime.datetime для объединения
                dt = datetime.combine(date_stc, time_pr)
                
                data.append((dt, power_stc))
            
            return data

def predict_future(data, future_minutes):
    # Преобразуем данные в массивы numpy
    times = np.array([(dt - data[0][0]).total_seconds() for dt, _ in data]).reshape(-1, 1)
    values = np.array([value for _, value in data]).reshape(-1, 1)

    # Обучаем модель линейной регрессии
    model = LinearRegression()
    model.fit(times, values)

    # Прогнозируем значения на будущее
    future_times = np.array([times[-1][0] + i * 60 for i in range(1, future_minutes + 1)]).reshape(-1, 1)
    future_values = model.predict(future_times)

    return future_values

async def save_predictions(obj, pool, predictions):
    async with pool.acquire() as connection:
        async with connection.cursor() as cursor:
            for i, power in enumerate(predictions):
                future_time = datetime.now() + timedelta(minutes=i + 1)
                date_pr = future_time.date()
                time_pr = seconds_to_time((future_time - datetime.combine(future_time.date(), time.min)).total_seconds())
                
                if power > obj['max_obj']: 
                    type_pr = "Krit"
                elif power < obj['max_obj'] * float(obj["percent_obj"]): 
                    type_pr = "Prost"
                else: 
                    type_pr = "Norm"

                # Проверяем наличие записи по часам и минутам
                check_query = """SELECT id_pr FROM predictor
                                 WHERE HOUR(time_pr) = HOUR(%s) AND MINUTE(time_pr) = MINUTE(%s) AND id_obj_pr = %s"""
                await cursor.execute(check_query, (time_pr, time_pr, obj['id_obj']))
                existing_record = await cursor.fetchone()

                if existing_record:
                    # Обновляем существующую запись
                    update_query = """UPDATE predictor SET power_pr = %s, type_pr = %s
                                      WHERE id_pr = %s"""
                    await cursor.execute(update_query, (power, type_pr, existing_record[0]))
                else:
                    # Вставляем новую запись
                    insert_query = """INSERT INTO predictor (date_pr, time_pr, power_pr, id_obj_pr, type_pr)
                                      VALUES (%s, %s, %s, %s, %s)"""
                    await cursor.execute(insert_query, (date_pr, time_pr, power, obj['id_obj'], type_pr))
            await connection.commit()



async def predict_capacity(obj, pool):
    try:
        # Сбор данных за последние 30 минут
        data = await collect_data(obj, pool, 30)

        # Если данных недостаточно, возвращаем None
        if len(data) < 2:
            return None

        # Прогнозируем значения на следующие 30 минут
        future_values = predict_future(data, 30)
        
        # Сохраняем прогнозы в базу данных
        await save_predictions(obj, pool, future_values.flatten().tolist())

    except Exception as e:
        print(f"Ошибка при прогнозировании мощности для объекта {obj['id_obj']}: {e}")
        return None

def seconds_to_time(seconds):
    # Преобразуем секунды в часы, минуты и секунды
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    seconds = int(seconds % 60)

    # Создаем объект datetime.time
    return time(hour=hours, minute=minutes, second=seconds)
