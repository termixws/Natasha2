from sqlmodel import create_engine, Session

DATABASE_URL = "sqlite:///./salon_natasha.db"

engine = create_engine(DATABASE_URL, echo=True)

def get_db():
    with Session(engine) as session:
        yield session
