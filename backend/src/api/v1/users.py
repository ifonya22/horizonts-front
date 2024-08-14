
from database.queries import get_db
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session


router = APIRouter(prefix="/api/v1/users")


@router.get("/")
def update_firm(db: Session = Depends(get_db)):
    return {"users": ["user1", "user2"]}
