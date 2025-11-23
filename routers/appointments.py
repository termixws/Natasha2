from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from models import Appointment
from schemas import AppointmentCreate, AppointmentRead, AppointmentUpdate
from database import get_db

app = APIRouter(prefix="/appointment", tags=["Appointment"])

@app.post("/", response_model=AppointmentRead)
def create_appointment(appointment: AppointmentCreate, db : Session = Depends(get_db)):
    db_appointment = db.exec(
        select(Appointment)
        .where(
            Appointment.master_id == appointment.master_id,
               Appointment.date_time == appointment.date_time
            )
        ).first()
    
    if db_appointment:
        raise HTTPException(status_code=400, detail="time slot is already booked")
    
    new_appointment = Appointment(
        date_time=appointment.date_time,
        user_id=appointment.user_id,
        master_id=appointment.master_id,
        service_id=appointment.service_id
    )
    db.add(new_appointment)
    db.commit()
    db.refresh(new_appointment)
    return new_appointment

@app.get("/", response_model=list[AppointmentRead])
def read_appointments(db : Session = Depends(get_db)):
    appointment = db.exec(select(Appointment)).all()
    return appointment

@app.get("/{appointment_id}",response_model=AppointmentRead)
def read_appointment(appointment_id : int, db: Session = Depends(get_db)):
    appointment = db.get(Appointment, appointment_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="not found")
    
    return appointment

@app.put("/{appointment_id}",response_model=AppointmentRead)
def update_appoinment(appointment_id : int, update_data: AppointmentUpdate, db: Session = Depends(get_db)):
    appointment = db.get(Appointment, appointment_id)
    if not appointment:
        raise HTTPException(status_code=404, detail="not found")
    
    update_data = update_data.dict(exclude_unset=True)

    for key, value in update_data.items():
        setattr(appointment, key, value)
    
    db.add(appointment)
    db.commit()
    db.refresh(appointment)
    return appointment

@app.delete("/{appointment_id}")
def delete_appointment(appointment_id: int, db : Session = Depends(get_db)):
    appointment = db.get(Appointment, appointment_id)
    if not appointment:
        raise HTTPException(status_code=404,detail="not found")
    
    db.delete(appointment)
    db.commit()
    return {"msg" : "appointment has deleted"}
