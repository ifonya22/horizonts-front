from typing import List
from pydantic import BaseModel


class CapacityPerMinute(BaseModel):
    minute: str
    total_capacity: float


class StatisticResponse(BaseModel):
    answer: List[CapacityPerMinute]
