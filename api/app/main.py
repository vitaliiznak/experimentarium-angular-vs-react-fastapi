from fastapi import FastAPI, Depends, HTTPException, status, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta, datetime
import secrets
from . import models, schemas, security
from .database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
   allow_origins=[
        "http://localhost:4201",
        "http://localhost:4200",  # Default Angular port
        "http://127.0.0.1:4201",
        "http://127.0.0.1:4200",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/auth/signup", response_model=schemas.User)
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user.email).first()
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
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/api/auth/login", response_model=schemas.Token)
def login(user_credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == user_credentials.email).first()
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
    """
    Send password reset email to user.
    In a production environment, this would use a proper email service.
    """
    # TODO: Implement actual email sending logic
    print(f"Password reset link would be sent to {email} with token: {token}")
    # For now, just print the reset link that would be sent
    reset_link = f"http://localhost:4200/auth/reset-password?token={token}"
    print(f"Reset link: {reset_link}")

@app.post("/api/auth/forgot-password")
async def forgot_password(
    email_request: schemas.EmailRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(models.User.email == email_request.email).first()
    if not user:
        # Don't reveal whether the email exists for security
        return {"message": "If the email exists, password reset instructions will be sent"}
    
    # Generate reset token
    reset_token = secrets.token_urlsafe(32)
    user.reset_token = reset_token
    user.reset_token_expires = datetime.utcnow() + timedelta(hours=24)
    
    db.commit()
    
    # Send email in background
    background_tasks.add_task(
        send_reset_email,
        email=user.email,
        token=reset_token
    )
    
    return {"message": "If the email exists, password reset instructions will be sent"}

@app.post("/api/auth/reset-password")
async def reset_password(
    reset_data: schemas.ResetPasswordRequest,
    db: Session = Depends(get_db)
):
    user = db.query(models.User).filter(
        models.User.reset_token == reset_data.token,
        models.User.reset_token_expires > datetime.utcnow()
    ).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired token"
        )
    
    # Fix: Use hashed_password instead of password
    user.hashed_password = security.get_password_hash(reset_data.new_password)
    user.reset_token = None
    user.reset_token_expires = None
    
    db.commit()
    
    return {"message": "Password successfully reset"}