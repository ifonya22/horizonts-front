from sqlalchemy import Boolean, Column, Date, Float, Integer, String, Time

from database.database import Base


# class Statistics(Base):
#     __tablename__ = "statistics"

#     id_stc = Column(Integer, primary_key=True, autoincrement=True)
#     date_stc = Column(Date, nullable=False)
#     time_stc = Column(Time, nullable=False)
#     power_stc = Column(Float, nullable=False)
#     id_obj_stc = Column(Integer, nullable=False)
#     id_type_stc = Column(String, nullable=False)

#     def __repr__(self):
#         return (
#             f"Statistics(id={self.id_stc}, "
#             f"date_stc={self.date_stc}, "
#             f"time_stc={self.time_stc}, "
#             f"power_stc={self.power_stc}, "
#             f"id_obj_stc={self.id_obj_stc})"
#             f"id_type_stc={self.id_type_stc})"
#         )


# class Status(Base):
#     __tablename__ = "statuses"

#     id_status = Column(Integer, primary_key=True, autoincrement=True)
#     time_begin = Column(Time, nullable=False)
#     time_end = Column(Time, nullable=False)
#     type_status = Column(String, nullable=False)
#     id_phider = Column(Integer, nullable=False)
#     date_status = Column(Date, nullable=False)
#     notification = Column(Integer, nullable=False)

#     def __repr__(self):
#         return (
#             f"Status(id_status={self.id_status}, "
#             f"time_begin={self.time_begin}, "
#             f"time_end={self.time_end}, "
#             f"type_status={self.type_status}, "
#             f"id_phider={self.id_phider}, "
#             f"date_status={self.date_status})"
#         )


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=True)
    email = Column(String(255), unique=True, index=True, nullable=True)
    hashed_password = Column(String(255), nullable=False)
    isadmin = Column(Integer, nullable=True, default=0)
    position = Column(String(255), nullable=True)


class Status(Base):
    __tablename__ = "statuses"

    id = Column(Integer, primary_key=True, index=True)
    type_status = Column(String(255), nullable=False)
