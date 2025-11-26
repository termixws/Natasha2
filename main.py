from fastapi import FastAPI
from sqlmodel import SQLModel
from database import engine
from routers import users, masters, services, appointments
import uvicorn

from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="Salon Natasha API")
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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