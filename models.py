from typing import Optional, List
from sqlmodel import SQLModel, Field, Relationship
from datetime import datetime
from pydantic import EmailStr

class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: EmailStr = Field(index=True, unique=True)
    hashed_password: str
    name: str

    appointments: List["Appointment"] = Relationship(back_populates="user")
    
    
class Master(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    sex: str
    phone: str
    experience: int
    specialty: str

    appointments: List["Appointment"] = Relationship(back_populates="master")


class Service(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    description: str
    price: float
    duration: int  # в минутах

    appointments: List["Appointment"] = Relationship(back_populates="service")


class Appointment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    date_time: datetime
    status: str = Field(default="scheduled")  # scheduled/completed/canceled

    user_id: int = Field(foreign_key="user.id")
    master_id: int = Field(foreign_key="master.id")
    service_id: int = Field(foreign_key="service.id")

    user: Optional[User] = Relationship(back_populates="appointments")
    master: Optional[Master] = Relationship(back_populates="appointments")
    service: Optional[Service] = Relationship(back_populates="appointments")
