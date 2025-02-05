import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import models
from app.database import engine
from app import auth



async def init_models() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(models.Base.metadata.create_all)

asyncio.create_task(init_models())

app = FastAPI()

# Configure CORS middleware.
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:4200",
        "http://localhost:4200",
        "http://127.0.0.1:8000",
        "http://localhost:8000",
        # Add additional origins as needed.
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include authentication router.
app.include_router(auth.router)