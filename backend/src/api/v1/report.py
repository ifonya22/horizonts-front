from database.queries import get_history_sql
from core.report import generate_excel_report
from fastapi import APIRouter
from fastapi.responses import FileResponse
from models.requests import Report
import os

router = APIRouter(prefix="/api/v1/report")


@router.post("/")
async def read_items(request: Report):
    result = await generate_excel_report(
        objects=request.objects,
        date_s=request.date_start,
        time_s=request.time_start,
        date_e=request.date_end,
        time_e=request.time_end,
    )
    if result:
        # headers = {'Content-Disposition': 'attachment; filename="Book.xlsx"'}
        return FileResponse(
            result,
            filename=os.path.basename(result),
            media_type="multipart/form-data",
        )
    return "NO DATA"


@router.post("/history")
async def get_history(request: Report):
    result = get_history_sql(request)

    return result
