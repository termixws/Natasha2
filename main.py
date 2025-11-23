from fastapi import FastAPI
from sqlmodel import SQLModel
from database import engine
from routers import users, masters, services, appointments
import uvicorn

app = FastAPI(title="Salon Natasha API")

SQLModel.metadata.create_all(engine)

@app.get("/")
def root():
    return {"message": "Welcome to Salon Natasha API"}

app.include_router(users.app)
app.include_router(masters.app)
app.include_router(services.app)
app.include_router(appointments.app)

if __name__ == "__main__": 
    uvicorn.run("main:app", reload=True)