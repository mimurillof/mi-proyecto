from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api import user_router, auth_router, ai_router
from .config import settings
from .database import engine
from .db_models import models

# Create the database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Mi Proyecto API",
    description="Backend para la aplicación de finanzas con IA.",
    version="0.1.0",
)

# Configuración de CORS
origins = [
    settings.CLIENT_ORIGIN,
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/api/health")
async def root():
    return {"status": "ok"}

app.include_router(auth_router.router, tags=["Auth"], prefix="/api/auth")
app.include_router(user_router.router, tags=["Users"], prefix="/api/users")
app.include_router(ai_router.router, tags=["AI"], prefix="/api/ai") 