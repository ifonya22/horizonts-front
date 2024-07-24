from sqlalchemy import Column, Date, Float, Integer, String, Time

from database.database import Base


class Statistic(Base):
    __tablename__ = "statistic"

    id = Column(Integer, primary_key=True, autoincrement=True)
    date_ = Column(Date, nullable=False)
    time_ = Column(Time, nullable=False)
    capacity = Column(Float, nullable=False)
    id_phider = Column(Integer, nullable=False)

    def __repr__(self):
        return (
            f"Statistic(id={self.id}, "
            f"date_={self.date_}, "
            f"time_={self.time_}, "
            f"capacity={self.capacity}, "
            f"id_phider={self.id_phider})"
        )


class Status(Base):
    __tablename__ = "statuses"

    id_status = Column(Integer, primary_key=True, autoincrement=True)
    time_begin = Column(Time, nullable=False)
    time_end = Column(Time, nullable=False)
    type_status = Column(String, nullable=False)
    id_phider = Column(Integer, nullable=False)
    date_status = Column(Date, nullable=False)
    notification = Column(Integer, nullable=False)

    def __repr__(self):
        return (
            f"Status(id_status={self.id_status}, "
            f"time_begin={self.time_begin}, "
            f"time_end={self.time_end}, "
            f"type_status={self.type_status}, "
            f"id_phider={self.id_phider}, "
            f"date_status={self.date_status})"
        )
