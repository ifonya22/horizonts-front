from datetime import timedelta

from core.auth import (
    authenticate_user,
    create_access_token,
    get_current_user,
    get_password_hash,
)
from database import models
from database.queries import get_db
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from models import user_schema
from sqlalchemy.orm import Session

ACCESS_TOKEN_EXPIRE_MINUTES = 30

router = APIRouter(prefix="/api/v1/auth")


@router.post("/token", response_model=user_schema.Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/users/me", response_model=user_schema.UserResponse)
async def read_users_me(
    current_user: user_schema.UserResponse = Depends(get_current_user),
):
    return current_user


@router.post("/users/", response_model=user_schema.UserResponse)
def create_user(user: user_schema.UserCreate, db: Session = Depends(get_db)):
    # Проверка, существует ли пользователь с таким же именем
    db_user = (
        db.query(models.User)
        .filter(models.User.username == user.username)
        .first()
    )
    if db_user:
        raise HTTPException(
            status_code=400, detail="Username already registered"
        )

    # Хэширование пароля
    hashed_password = get_password_hash(user.password)

    # Создание нового пользователя
    new_user = models.User(
        username=user.username, hashed_password=hashed_password
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user
