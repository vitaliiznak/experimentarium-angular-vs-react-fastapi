from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
import socket

def get_db_host() -> str:
    """
    Returns appropriate database host depending on the environment:
    - Returns host.docker.internal when running in Docker
    - Returns localhost when running locally
    """
    try:
        # Try to resolve host.docker.internal
        socket.gethostbyname('host.docker.internal')
        return 'host.docker.internal'
    except socket.gaierror:
        return 'localhost'

# Database configuration with smart defaults
DB_HOST = os.getenv('DB_HOST', get_db_host())
DB_PORT = os.getenv('DB_PORT', '5432')
DB_USER = os.getenv('DB_USER', 'postgres')
DB_PASSWORD = os.getenv('DB_PASSWORD', 'postgres')
DB_NAME = os.getenv('DB_NAME', 'auth_db')

SQLALCHEMY_DATABASE_URL = os.getenv(
    'DATABASE_URL',
    f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 