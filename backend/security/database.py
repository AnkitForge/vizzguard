import os
from sqlalchemy import create_engine, Column, Integer, String, Boolean
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv

load_dotenv()

# We set a default Postgres URL if one isn't in environment
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://vizzguard_user:SvA43HwyxwVZ7vPUmGSMPKWIhAkW32Qs@dpg-d744vvkr85hc73fknitg-a/vizzguar")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
