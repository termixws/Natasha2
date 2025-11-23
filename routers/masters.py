from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from models import Master
from schemas import MasterCreate, MasterRead, MasterUpdate
from database import get_db

app = APIRouter(prefix="/master", tags=["Master"])

@app.post("/", response_model=MasterRead)
def create_master(master: MasterCreate, db: Session = Depends(get_db)):
    try:
        db_master = db.exec(select(Master).where(Master.phone == master.phone)).first()
        if db_master:
            raise HTTPException(status_code=400, detail="master already added")
        
        new_master = Master(
            name=master.name,
            sex=master.sex,
            phone=master.phone,
            experience=master.experience,
            specialty=master.specialty
        )
        
        db.add(new_master)
        db.commit()
        db.refresh(new_master)
        return new_master
        
    except Exception as e:
        db.rollback()
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail="Failed to create master")
    

@app.get("/", response_model=list[MasterRead])
def read_masters(db: Session = Depends(get_db)):
    masters = db.exec(select(Master)).all()
    return masters

@app.get("/{master_id}", response_model=MasterRead)
def read_master(master_id: int,db: Session = Depends(get_db)):
    master = db.get(Master, master_id)
    if not master:
        raise HTTPException(status_code=404, detail="not found")

    return master

@app.put("/{master_id}", response_model=MasterRead)
def update_master(master_id: int, db: Session = Depends(get_db)):
    master = db.get(Master, master_id)
    if not master:
        raise HTTPException(status_code=404, detail="not found")
    
    update_data = update_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(master, key, value)
    
    db.add(master)
    db.commit()
    db.refresh(master)
    return master

@app.delete("/{master_id}")
def delete_master(master_id: int, db: Session = Depends(get_db)):
    master = db.get(Master, master_id)
    if not master:
        raise HTTPException(status_code=404,detail="not found")
    
    db.delete(master)
    db.commit()
    return {"msg" : "master has deleted"}
