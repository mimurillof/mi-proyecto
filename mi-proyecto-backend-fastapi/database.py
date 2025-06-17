from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base
from .config import settings

# The `+asyncpg` tells SQLAlchemy to use the asyncpg driver.
DATABASE_URL = settings.DATABASE_URL
if DATABASE_URL and not DATABASE_URL.startswith("postgresql+asyncpg"):
     if DATABASE_URL.startswith("postgresql"):
        DATABASE_URL = DATABASE_URL.replace("postgresql", "postgresql+asyncpg", 1)

engine = create_async_engine(DATABASE_URL)

AsyncSessionLocal = sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
    autocommit=False,
    autoflush=False,
)

Base = declarative_base()

async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        yield session 