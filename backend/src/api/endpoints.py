from api.v1 import items, statistic
from fastapi import APIRouter

api_router = APIRouter()

api_router.include_router(items.router)
api_router.include_router(statistic.router)
