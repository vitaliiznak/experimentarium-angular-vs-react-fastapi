import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.main import app
from app.database import Base, get_db

@pytest.fixture(scope="session")
def test_db():
    SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"
    engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False})
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
    Base.metadata.create_all(bind=engine)
    
    def override_get_db():
        try:
            db = TestingSessionLocal()
            yield db
        finally:
            db.close()
    
    app.dependency_overrides[get_db] = override_get_db
    
    yield TestingSessionLocal
    
    Base.metadata.drop_all(bind=engine)

@pytest.fixture
def client(test_db):
    return TestClient(app)

@pytest.fixture
def test_user(client):
    user_data = {
        "name": "Test User",
        "email": "test@example.com",
        "password": "testpassword123"
    }
    response = client.post("/api/auth/signup", json=user_data)
    return response.json() 