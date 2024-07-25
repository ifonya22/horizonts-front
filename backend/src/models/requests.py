from dataclasses import dataclass
from datetime import datetime


@dataclass
class StatisticRequest:
    factory_id: int
    start_date: datetime

    def __post_init__(self):
        self.start_date_str = self.start_date.strftime("%Y-%m-%d")

    def to_dict(self):
        return {
            "factory_id": self.factory_id,
            "start_date": self.start_date_str,
        }


@dataclass
class StandstillRequest:
    factory_id: int
