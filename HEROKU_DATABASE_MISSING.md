# 🚨 PROBLEMA CRÍTICO: Base de Datos Falta en Heroku

**Fecha:** 19 de octubre de 2025  
**Error:** `ConnectionRefusedError: [Errno 111] Connection refused`  
**Causa Raíz:** **NO hay base de datos PostgreSQL configurada en Heroku**

---

## 🔍 **DIAGNÓSTICO**

### **Error en Logs:**
```
sqlalchemy.exc.OperationalError: [Errno 111] Connection refused
```

### **Verificación:**
```powershell
heroku config --app horizon-backend | Select-String "DATABASE"
# Resultado: (vacío) ← NO EXISTE DATABASE_URL
```

### **Conclusión:**
El backend **requiere PostgreSQL** para:
- Autenticación (tabla `users`)
- Almacenar portfolios
- Gestionar sesiones

**SIN base de datos → TODOS los endpoints fallan con 500 Internal Server Error**

---

## ✅ **SOLUCIÓN: Agregar PostgreSQL a Heroku**

### **Opción 1: Usar Addon de Heroku (Mini Plan - Gratis hasta cierto límite)**

```powershell
# Agregar PostgreSQL addon
heroku addons:create heroku-postgresql:mini --app horizon-backend

# Verificar que se creó
heroku config --app horizon-backend | Select-String "DATABASE"
```

**Salida esperada:**
```
DATABASE_URL: postgres://username:password@hostname:5432/dbname
```

---

### **Opción 2: Usar Supabase PostgreSQL (Ya lo tienes configurado)**

Tu archivo `.env` ya tiene Supabase configurado. Podemos usar su PostgreSQL.

#### **Paso 1: Obtener la CONNECTION STRING de Supabase**

1. Ve a: https://supabase.com/dashboard/project/tlmdrkthueicqnvbjmie/settings/database
2. Copia la **Connection string** en formato PostgreSQL:

```
postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
```

#### **Paso 2: Configurarla en Heroku**

```powershell
# Reemplaza <CONNECTION_STRING> con la cadena de Supabase
heroku config:set DATABASE_URL="<CONNECTION_STRING>" --app horizon-backend
```

**Ejemplo:**
```powershell
heroku config:set DATABASE_URL="postgresql://postgres.tlmdrkthueicqnvbjmie:[YOUR_PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres" --app horizon-backend
```

#### **Paso 3: Ejecutar Migraciones**

```powershell
# Conectarte a la DB de Heroku y crear tablas
heroku run python -c "from database import engine; from db_models.models import Base; import asyncio; asyncio.run(Base.metadata.create_all(bind=engine))" --app horizon-backend
```

**Alternativa (si tienes Alembic):**
```powershell
heroku run alembic upgrade head --app horizon-backend
```

---

## 🎯 **PLAN RECOMENDADO: Usar Supabase**

### **Ventajas:**
✅ Ya tienes Supabase configurado  
✅ Gratis hasta 500MB  
✅ Mismo proveedor que usas para Storage  
✅ No necesitas otro addon

### **Pasos:**

1. **Obtener Connection String de Supabase:**
   - Dashboard → Settings → Database → Connection string
   - Copiar la versión "Session mode" o "Transaction mode"

2. **Configurar en Heroku:**
   ```powershell
   heroku config:set DATABASE_URL="<SUPABASE_CONNECTION_STRING>" --app horizon-backend
   ```

3. **Reiniciar Heroku:**
   ```powershell
   heroku restart --app horizon-backend
   ```

4. **Crear tablas (si no existen):**
   Ejecutar tu script `init_db.py` o migración de Alembic

5. **Verificar:**
   ```powershell
   heroku logs --tail --app horizon-backend
   ```

   **Logs esperados:**
   ```
   INFO: Application startup complete ✅
   ```

---

## 🧪 **TESTING DESPUÉS DE CONFIGURAR**

### **1. Verificar conexión a DB:**
```powershell
heroku run python -c "from database import engine; print('DB Connected:', engine)" --app horizon-backend
```

### **2. Registrar usuario:**
```powershell
$body = '{\"email\":\"test@horizonportfolio.com\",\"password\":\"test1234\"}'
curl.exe -X POST "https://horizon-backend-316b23e32b8b.herokuapp.com/api/auth/register" `
  -H "Content-Type: application/json" `
  -d $body
```

**Salida esperada:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {"user_id": 1, "email": "test@horizonportfolio.com"}
}
```

### **3. Login:**
```powershell
curl.exe -X POST "https://horizon-backend-316b23e32b8b.herokuapp.com/api/auth/login" `
  -H "Content-Type: application/x-www-form-urlencoded" `
  -d "username=test@horizonportfolio.com&password=test1234"
```

**Salida esperada:**
```json
{
  "access_token": "eyJhbGc...",
  "token_type": "bearer"
}
```

---

## 📋 **CHECKLIST**

- [ ] Obtener Connection String de Supabase
- [ ] Configurar `DATABASE_URL` en Heroku
- [ ] Reiniciar app en Heroku
- [ ] Ejecutar migraciones/crear tablas
- [ ] Verificar logs (sin errores de conexión)
- [ ] Registrar usuario de prueba
- [ ] Hacer login y obtener token
- [ ] Guardar token en localStorage del navegador
- [ ] Verificar que endpoints retornan 200 OK

---

## 🚀 **SIGUIENTE PASO**

**Opción A: Usar addon de Heroku PostgreSQL**
```powershell
heroku addons:create heroku-postgresql:mini --app horizon-backend
```

**Opción B: Usar Supabase (Recomendado)**
1. Obtén el Connection String de Supabase Dashboard
2. Configúralo:
   ```powershell
   heroku config:set DATABASE_URL="<TU_CONNECTION_STRING>" --app horizon-backend
   ```

---

¿Cuál opción prefieres: Heroku PostgreSQL (A) o Supabase (B)?
