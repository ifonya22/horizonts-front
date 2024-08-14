FROM python:3.11-slim-bullseye

WORKDIR /app

COPY pyproject.toml poetry.lock /app/

RUN python -m pip install --no-cache-dir poetry==1.8.3 \
    && poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi \
    && rm -rf $(poetry config cache-dir)/{cache,artifacts}

# RUN apt-get update && apt-get install ffmpeg libsm6 libxext6  -y

# COPY .env /app

COPY . /app

CMD ["poetry", "run", "python", "main.py"]