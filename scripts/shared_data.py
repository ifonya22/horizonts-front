import os

USER_ = os.getenv("DB_USER")
PASSWORD_ = os.getenv("DB_PASSWORD")
HOST_ = os.getenv("MYSQL_HOST")
PORT_ = int(os.getenv("MYSQL_PORT"))
DB_ = os.getenv("MYSQL_DATABASE")
SLEEP_ = 60
JSON_PATH_ = "data"

