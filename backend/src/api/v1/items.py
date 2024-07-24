from fastapi import APIRouter

router = APIRouter(prefix="/api/v1/items")


@router.get("/")
async def read_items():
    return [{"item_id": "Foo"}]
