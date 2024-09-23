FROM python:3.11.10-slim-bullseye

RUN apt-get update && apt-get install -y tzdata

# Установка часового пояса
ENV TZ=Europe/Moscow
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /app

# RUN python -m pip install --upgrade pip && python -m pip cache purge

COPY pyproject.toml poetry.lock /app/

RUN python -m pip install --no-cache-dir poetry==1.8.3 \
    && poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi \
    && rm -rf $(poetry config cache-dir)/{cache,artifacts}

COPY . /app

CMD ["poetry", "run", "python", "main.py"]
