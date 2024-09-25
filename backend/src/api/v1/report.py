import os

from core.report import generate_excel_report
from database.queries import get_db, get_history_sql
from fastapi import APIRouter, Depends
from fastapi.responses import FileResponse
from models.requests import Report
from sqlalchemy.orm import Session

router = APIRouter(prefix="/api/v1/report")


@router.post("/")
async def read_items(request: Report):
    result = await generate_excel_report(
        objects=sorted(request.objects),
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

from datetime import timedelta, date
from pydantic import BaseModel
from typing import List, Tuple

class ReportItem(BaseModel):
    workshop_name: str
    event_date: date 
    event_time_start: str      
    value: int       
    id_obj: int      
    status: str  
    

class ReportResponse(BaseModel):
    data: List[ReportItem]

@router.post("/history")
async def get_history(request: Report, db: Session = Depends(get_db)) -> ReportResponse:
    result = get_history_sql(
        db=db,
        objects=request.objects,
        date_start=request.date_start,
        time_start=request.time_start,
        date_end=request.date_end,
        time_end=request.time_end,
    )

    report_items = []
    for workshop_name, event_date, event_time_start, value, id_obj, status in result:
        report_item = ReportItem(
            workshop_name=workshop_name,
            event_date=event_date,
            event_time_start=event_time_start,
            value=value,
            id_obj=id_obj,
            status=status,
        )
        report_items.append(report_item)

    # Создание экземпляра ReportResponse
    response = ReportResponse(data=report_items)

    return response
