from typing import Optional
from sqlmodel import SQLModel
from datetime import datetime
from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: str

class UserRead(BaseModel):
    id: int
    email: EmailStr

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserUpdate(SQLModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    password: Optional[str] = None
    

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class MasterCreate(SQLModel):
    name: str
    sex: str
    phone: str
    experience: int
    specialty: str

class MasterRead(SQLModel):
    id: int
    name: str
    sex: str
    phone: str
    experience: int
    specialty: str

class MasterUpdate(SQLModel):
    name: Optional[str] = None
    sex: Optional[str] = None
    phone: Optional[str] = None
    experience: Optional[int] = None
    specialty: Optional[str] = None

class ServiceCreate(SQLModel):
    name: str
    description: str
    price: float
    duration: int

class ServiceRead(SQLModel):
    id: int
    name: str
    description: str
    price: float
    duration: int

class ServiceUpdate(SQLModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    duration: Optional[int] = None


class AppointmentCreate(SQLModel):
    date_time: datetime
    user_id: int
    master_id: int
    service_id: int

class AppointmentRead(SQLModel):
    id: int
    date_time: datetime
    status: str
    user_id: int
    master_id: int
    service_id: int

class AppointmentUpdate(SQLModel):
    date_time: Optional[datetime] = None
    status: Optional[str] = None
    user_id: Optional[int] = None
    master_id: Optional[int] = None
    service_id: Optional[int] = None
