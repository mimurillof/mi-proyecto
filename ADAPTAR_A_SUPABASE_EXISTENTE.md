# 🔧 CAMBIOS PARA ADAPTAR A ESTRUCTURA EXISTENTE DE SUPABASE

## 📋 Resumen

El código actual está diseñado para usar `id` (BigInteger) pero Supabase usa `user_id` (UUID). Necesitamos adaptar 3 archivos clave.

---

## ✅ PASO 1: Actualizar `db_models/models.py`

Reemplaza TODO el contenido del archivo con esto:

```python
from sqlalchemy import Column, String, Boolean, Date, DateTime, Enum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from database import Base
import enum
import uuid

# Enum types que ya existen en Supabase
class GenderEnum(str, enum.Enum):
    male = "male"
    female = "female"
    other = "other"
    prefer_not_to_say = "prefer_not_to_say"

class User(Base):
    """
    Modelo adaptado a la tabla 'users' existente en Supabase.
    Campos: user_id (UUID), email, password_hash, first_name, last_name, 
            birth_date, gender, created_at, has_completed_onboarding
    """
    __tablename__ = "users"
    
    # Usar user_id (UUID) en lugar de id (BigInteger)
    user_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    first_name = Column(String)
    last_name = Column(String)
    birth_date = Column(Date)
    gender = Column(Enum(GenderEnum, name='gender_enum'))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    has_completed_onboarding = Column(Boolean, default=False)
```

---

## ✅ PASO 2: Actualizar `crud/user_service.py`

Reemplaza TODO el contenido del archivo con esto:

```python
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from db_models.models import User
from models.schemas import UserCreate
from auth.security import get_password_hash, verify_password
from typing import Optional
import uuid

class UserCRUD:
    async def get_user_by_id(self, db: AsyncSession, user_id: uuid.UUID) -> Optional[User]:
        """Get user by user_id (UUID)"""
        result = await db.execute(
            select(User).where(User.user_id == user_id)
        )
        return result.scalar_one_or_none()
    
    async def get_user_by_email(self, db: AsyncSession, email: str) -> Optional[User]:
        """Get user by email"""
        result = await db.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()
    
    async def create_user(self, db: AsyncSession, user: UserCreate) -> User:
        """Create a new user with UUID"""
        hashed_password = get_password_hash(user.password)
        db_user = User(
            email=user.email,
            password_hash=hashed_password
        )
        db.add(db_user)
        await db.commit()
        await db.refresh(db_user)
        
        return db_user
    
    async def authenticate_user(self, db: AsyncSession, email: str, password: str) -> Optional[User]:
        """Authenticate user with email and password"""
        user = await self.get_user_by_email(db, email)
        if not user or not verify_password(password, str(user.password_hash)):
            return None
        return user

# Create instance
user_crud = UserCRUD()
```

---

## ✅ PASO 3: Actualizar `auth/security.py`

Busca la función `create_access_token` y actualízala para usar `user_id`:

Reemplaza:
```python
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    # ... resto del código
```

Con:
```python
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    # Convertir UUID a string si existe
    if "sub" in to_encode and isinstance(to_encode["sub"], uuid.UUID):
        to_encode["sub"] = str(to_encode["sub"])
    # ... resto del código
```

Y agrega el import al principio del archivo:
```python
import uuid
```

---

## ✅ PASO 4: Actualizar `api/auth_router.py`

Busca la línea que crea el JWT token y cámbiala:

Reemplaza:
```python
access_token = create_access_token(data={"sub": user.email})
```

Con:
```python
access_token = create_access_token(data={"sub": str(user.user_id), "email": user.email})
```

---

## 🚀 PASO 5: Desplegar a Heroku

Una vez que hayas hecho todos los cambios:

```powershell
# 1. Commit los cambios
git add .
git commit -m "Adapt models to existing Supabase schema with UUID"

# 2. Push a Heroku
git push heroku master

# 3. Esperar 30 segundos para que redeploy complete
Start-Sleep -Seconds 30
```

---

## ✅ PASO 6: Probar el registro

```powershell
$registerBody = @{email="admin@horizonportfolio.com"; password="Horizon2025!"} | ConvertTo-Json
Invoke-RestMethod -Uri "https://horizon-backend-316b23e32b8b.herokuapp.com/api/auth/register" -Method POST -Headers @{"Content-Type"="application/json"} -Body $registerBody
```

---

## ✅ PASO 7: Obtener JWT Token

```powershell
$body = "username=admin@horizonportfolio.com&password=Horizon2025!"
$loginResponse = Invoke-RestMethod -Uri "https://horizon-backend-316b23e32b8b.herokuapp.com/api/auth/login" -Method POST -Headers @{"Content-Type"="application/x-www-form-urlencoded"} -Body $body

Write-Host "`n✅ TOKEN JWT:" -ForegroundColor Green
Write-Host $loginResponse.access_token -ForegroundColor Cyan

Write-Host "`n📋 COPIA ESTE COMANDO EN LA CONSOLA DEL NAVEGADOR (F12 > Console):" -ForegroundColor Yellow
Write-Host "localStorage.setItem('token', '$($loginResponse.access_token)');" -ForegroundColor Magenta
Write-Host "`nLuego recarga la página (F5)" -ForegroundColor Cyan
```

---

## 🎯 Resultado Esperado

1. ✅ Registro exitoso crea usuario con UUID en Supabase
2. ✅ Login retorna JWT token válido
3. ✅ Frontend puede usar el token para autenticarse
4. ✅ Los errores 403 desaparecen

---

## 🆘 Si hay errores

Cópiame el error completo y lo resolveremos.
