from datetime import timedelta, datetime
import secrets

from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app import models, security
from app.database import get_db
from . import schemas

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/signup", response_model=schemas.Token)
async def signup(user: schemas.UserCreate, db: AsyncSession = Depends(get_db)) -> dict:
    result = await db.execute(select(models.User).filter(models.User.email == user.email))
    db_user = result.scalar_one_or_none()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    hashed_password = security.get_password_hash(user.password)
    db_user = models.User(
        email=user.email,
        name=user.name,
        hashed_password=hashed_password
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={"sub": db_user.email},
        expires_delta=access_token_expires
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": db_user
    }

@router.post("/login", response_model=schemas.Token)
async def login(user_credentials: schemas.UserLogin, db: AsyncSession = Depends(get_db)) -> dict:
    result = await db.execute(select(models.User).filter(models.User.email == user_credentials.email))
    user = result.scalar_one_or_none()
    if not user or not security.verify_password(user_credentials.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=security.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={"sub": user.email},
        expires_delta=access_token_expires
    )
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user
    }

async def send_reset_email(email: str, token: str) -> None:
    reset_link = f"http://localhost:4200/auth/reset-password?token={token}"
    # In production, you would use an email service here
    print(f"Password reset link: {reset_link}")

@router.post("/forgot-password")
async def forgot_password(
    email_request: schemas.EmailRequest,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
) -> dict:
    result = await db.execute(select(models.User).filter(models.User.email == email_request.email))
    user = result.scalar_one_or_none()
    if not user:
        # Don't reveal whether the email exists for security reasons.
        return {"message": "If the email exists, password reset instructions will be sent"}
    
    reset_token = secrets.token_urlsafe(32)
    user.reset_token = reset_token
    user.reset_token_expires = datetime.utcnow() + timedelta(hours=24)
    
    await db.commit()
    
    # Dispatch the reset email in the background.
    background_tasks.add_task(send_reset_email, email=user.email, token=reset_token)
    
    return {"message": "If the email exists, password reset instructions will be sent"}

@router.post("/reset-password")
async def reset_password(
    reset_data: schemas.ResetPasswordRequest,
    db: AsyncSession = Depends(get_db)
) -> dict:
    result = await db.execute(
        select(models.User).filter(
            models.User.reset_token == reset_data.token,
            models.User.reset_token_expires > datetime.utcnow()
        )
    )
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired token"
        )
    
    user.hashed_password = security.get_password_hash(reset_data.new_password)
    user.reset_token = None
    user.reset_token_expires = None
    
    await db.commit()
    
    return {"message": "Password successfully reset"} 