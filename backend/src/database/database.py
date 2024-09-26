import os
import time
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from fastapi.logger import logger
Base = declarative_base()

DATABASE_URL = os.getenv("DATABASE_URL")
logger.warning(DATABASE_URL)
try:
    engine = create_engine(DATABASE_URL)
    Base.metadata.create_all(engine)
except Exception as e:
    print(f"Initial connection failed: {e}, retrying in 10 seconds...")
    time.sleep(10)
    engine = create_engine(DATABASE_URL)
    Base.metadata.create_all(engine)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
