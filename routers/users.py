from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from models import User
from schemas import UserCreate, UserRead, Token, UserLogin, UserUpdate
from database import get_db
from auth import get_password_hash, verify_password
from jwy import create_access_token

app = APIRouter(prefix="/users", tags=["Users"])


@app.post("/", response_model=UserRead)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    db_user = db.exec(select(User).where(User.email == user.email)).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)

    new_user = User(
        name=user.name,
        email=user.email,
        hashed_password=hashed_password,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/login/", response_model=Token)
def login(user: UserLogin, session: Session = Depends(get_db)):
    statement = select(User).where(User.email == user.email)
    db_user = session.exec(statement).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(status_code=404, detail="Неправильный email или пароль")
    access_token = create_access_token({"sub": db_user.email, "user_id": db_user.id})
    return Token(access_token=access_token)

@app.get("/", response_model=list[UserRead])
def read_users(db: Session = Depends(get_db)):
    users = db.exec(select(User)).all()
    return users


@app.get("/{user_id}", response_model=UserRead)
def read_user(user_id: int, db: Session = Depends(get_db)):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@app.put("/{user_id}", response_model=UserRead)
def update_user(user_id: int, update_data: UserUpdate, db: Session = Depends(get_db)):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    for key, value in update_data.items():
        setattr(user, key, value)

    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@app.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = db.get(User, user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(user)
    db.commit()
    return {"message": "User deleted"}