from dataclasses import dataclass
from datetime import datetime


@dataclass
class StatisticRequest:
    factory_id: int
    start_date: datetime
    end_date: datetime

    def __post_init__(self):
        self.start_date_str, self.start_time = self.start_date.strftime(
            "%Y-%m-%d"
        ), self.start_date.strftime("%H:%M:%S")
        self.end_date, self.end_time = self.start_date.strftime(
            "%Y-%m-%d"
        ), self.start_date.strftime("%H:%M:%S")

    def to_dict(self):
        return {
            "factory_id": self.factory_id,
            "start_date": self.start_date_str,
        }


@dataclass
class StandstillRequest:
    factory_id: int


from pydantic import BaseModel
from typing import List

class Equipment(BaseModel):
    name: str
    description: str

class Workshop(BaseModel):
    key: str
    name: str
    equipment: List[Equipment]

class AddFirm(BaseModel):
    firmName: str
    workshops: List[Workshop]

