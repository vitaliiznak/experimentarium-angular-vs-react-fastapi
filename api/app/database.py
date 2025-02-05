from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import SQLALCHEMY_DATABASE_ASYNC_URL

# Create an async engine using the async URL:
engine = create_async_engine(
    SQLALCHEMY_DATABASE_ASYNC_URL,
    echo=True,
    future=True
)

# Configure the async sessionmaker
AsyncSessionLocal = sessionmaker(
    bind=engine,
    expire_on_commit=False,
    class_=AsyncSession
)

Base = declarative_base()

# Dependency that provides an AsyncSession instance
async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session 