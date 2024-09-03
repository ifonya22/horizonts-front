from database.queries import get_db
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database.queries import get_users

router = APIRouter(prefix="/api/v1/users")


@router.get("/")
def get_all_users(db: Session = Depends(get_db)):
    result = get_users(db)
    return result
