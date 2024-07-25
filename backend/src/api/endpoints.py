from api.v1 import factory, items, statistic, phider
from fastapi import APIRouter

api_router = APIRouter()

api_router.include_router(items.router, tags=["v1/items"])
api_router.include_router(statistic.router, tags=["v1/statistic"])
api_router.include_router(factory.router, tags=["v1/factory"])
api_router.include_router(phider.router, tags=["v1/phider"])
