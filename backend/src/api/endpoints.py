from api.v1 import auth, firm, items, report, statistic, users
from fastapi import APIRouter

api_router = APIRouter()

api_router.include_router(items.router, tags=["v1/items"])
api_router.include_router(statistic.router, tags=["v1/statistic"])
api_router.include_router(firm.router, tags=["v1/firm"])
api_router.include_router(users.router, tags=["v1/users"])
api_router.include_router(auth.router, tags=["v1/auth"])
api_router.include_router(report.router, tags=["v1/report"])
