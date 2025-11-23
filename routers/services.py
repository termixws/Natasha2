from schemas import ServiceCreate, ServiceRead, ServiceUpdate
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from models import Service
from database import get_db

app = APIRouter(prefix="/service", tags=["Service"])

@app.post("/",response_model=ServiceRead)
def create_service(service: ServiceCreate, db: Session = Depends(get_db)):
    db_service = db.exec(select(Service).where(Service.name == service.name)).first()
    if db_service:
        raise HTTPException(status_code=404, detail="service already added")
    
    new_sercie=Service(
        name=service.name,
        description=service.description,
        price=service.price,
        duration=service.duration
    )
    db.add(new_sercie)
    db.commit()
    db.refresh(new_sercie)
    return new_sercie

@app.get("/", response_model=list[ServiceRead])
def get_services(db: Session = Depends(get_db)):
    services = db.exec(select(Service)).all()
    return services

@app.get("/{service_id}", response_model=ServiceRead)
def get_service(service_id : int, db: Session = Depends(get_db)):
    service = db.get(Service, service_id)
    if not service:
        raise HTTPException(status_code=404, detail="service not found")
    
    return service

@app.put("/{service_id}", response_model=ServiceRead)
def update_service(service_id: int, update_data: ServiceUpdate, db: Session = Depends(get_db)):
    service = db.get(Service, service_id)
    if not service:
        raise HTTPException(status_code=404, detail="not found")
    
    update_dict = update_data.model_dump(exclude_unset=True)

    for key, value in update_dict.items():
        setattr(service, key, value)

    db.add(service)
    db.commit()
    db.refresh(service)
    return service

@app.delete("/{service_id}")
def delete_service(service_id: int, db: Session = Depends(get_db)):
    service = db.get(Service, service_id)
    if not service:
        raise HTTPException(status_code=404, detail="not found")
    
    db.delete(service)
    db.commit()
    return {"msg" : "service has deleted"}
