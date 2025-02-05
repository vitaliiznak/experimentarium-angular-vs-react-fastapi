from datetime import datetime, timedelta
from typing import Optional
import secrets
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app import models, schemas, security
from app.common.exceptions import ConflictException, NotFoundException, UnauthorizedException

class AuthService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def register_user(self, user_data: schemas.UserCreate) -> models.User:
        result = await self.db.execute(
            select(models.User).filter(models.User.email == user_data.email)
        )
        if result.scalar_one_or_none():
            raise ConflictException("Email already registered")
        
        hashed_password = security.get_password_hash(user_data.password)
        user = models.User(
            email=user_data.email,
            name=user_data.name,
            hashed_password=hashed_password
        )
        
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user

    async def authenticate_user(self, credentials: schemas.UserLogin) -> models.User:
        result = await self.db.execute(
            select(models.User).filter(models.User.email == credentials.email)
        )
        user = result.scalar_one_or_none()
        
        if not user or not security.verify_password(credentials.password, user.hashed_password):
            raise UnauthorizedException("Incorrect email or password")
            
        return user

    async def initiate_password_reset(self, email: str) -> Optional[models.User]:
        result = await self.db.execute(
            select(models.User).filter(models.User.email == email)
        )
        user = result.scalar_one_or_none()
        
        if user:
            user.reset_token = secrets.token_urlsafe(32)
            user.reset_token_expires = datetime.utcnow() + timedelta(hours=24)
            await self.db.commit()
            
        return user  # Return user or None to handle email existence ambiguity

    async def complete_password_reset(self, token: str, new_password: str) -> models.User:
        result = await self.db.execute(
            select(models.User).filter(
                models.User.reset_token == token,
                models.User.reset_token_expires > datetime.utcnow()
            )
        )
        user = result.scalar_one_or_none()
        
        if not user:
            raise NotFoundException("Invalid or expired token")
            
        user.hashed_password = security.get_password_hash(new_password)
        user.reset_token = None
        user.reset_token_expires = None
        await self.db.commit()
        
        return user

    @staticmethod
    def create_access_token(user: models.User) -> str:
        access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
        return security.create_access_token(
            data={"sub": user.email},
            expires_delta=access_token_expires
        )
