import os
from dotenv import load_dotenv
from typing import Final
import os
import socket

load_dotenv()

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

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")  # In production, use environment variable
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

SQLALCHEMY_DATABASE_URL = os.getenv(
    'DATABASE_URL',
    f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
)

