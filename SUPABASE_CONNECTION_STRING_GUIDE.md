# 🔧 Guía: Obtener la Cadena de Conexión Correcta de Supabase

## ❌ Problema Actual

El error `Tenant or user not found` indica que el formato del usuario en el `DATABASE_URL` es incorrecto.

**Cadena actual (INCORRECTA):**
```
postgresql+asyncpg://postgres.tlmdrkthueicqnvbjmie:Mikiangel29@aws-0-us-west-1.pooler.supabase.com:6543/postgres
```

## ✅ Solución: Obtener la Cadena Correcta

### Paso 1: Acceder al Dashboard de Supabase

1. Ve a: https://supabase.com/dashboard/project/tlmdrkthueicqnvbjmie
2. Inicia sesión con tu cuenta de Supabase

### Paso 2: Obtener la Connection String

1. En el menú lateral izquierdo, haz clic en **"Settings"** ⚙️
2. Luego selecciona **"Database"**
3. Desplázate hasta la sección **"Connection string"**
4. Selecciona el modo **"Session"** (recomendado) o **"Transaction"**
5. **COPIA** la cadena completa que aparece

**Debe verse así:**
```
postgresql://postgres:[YOUR-PASSWORD]@db.tlmdrkthueicqnvbjmie.supabase.co:5432/postgres
```

O en modo pooler:
```
postgresql://postgres.tlmdrkthueicqnvbjmie:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres
```

### Paso 3: Modificar el DATABASE_URL

**IMPORTANTE:** Necesitas hacer dos cambios:

1. **Reemplazar `[YOUR-PASSWORD]` con tu contraseña de base de datos de Supabase**
   - ⚠️ **NO uses tu contraseña de cuenta de Supabase**
   - ⚠️ **Usa la contraseña específica de la base de datos**
   - Si no la recuerdas, puedes resetearla en Settings > Database > "Reset database password"

2. **Cambiar `postgresql://` por `postgresql+asyncpg://`**
   - Esto es CRÍTICO para que SQLAlchemy use asyncpg

### Paso 4: Configurar en Heroku

Una vez que tengas la cadena correcta, ejecuta:

```powershell
# Ejemplo con la cadena corregida (REEMPLAZA CON LA TUYA)
heroku config:set DATABASE_URL="postgresql+asyncpg://postgres:[TU-PASSWORD-DB]@db.tlmdrkthueicqnvbjmie.supabase.co:5432/postgres" --app horizon-backend
```

O si usas pooler:

```powershell
heroku config:set DATABASE_URL="postgresql+asyncpg://postgres.tlmdrkthueicqnvbjmie:[TU-PASSWORD-DB]@aws-0-us-west-1.pooler.supabase.com:6543/postgres" --app horizon-backend
```

### Paso 5: Verificar y Reiniciar

```powershell
# Verificar que se configuró correctamente
heroku config --app horizon-backend | Select-String "DATABASE"

# Reiniciar la app
heroku restart --app horizon-backend

# Crear las tablas
heroku run python init_db.py --app horizon-backend
```

---

## 🔍 Cómo Saber si la Contraseña es Correcta

La contraseña de la base de datos de Supabase:
- ✅ Es diferente a tu contraseña de login de Supabase
- ✅ Se configuró cuando creaste el proyecto
- ✅ Se puede resetear en Settings > Database > "Reset database password"

**Si no recuerdas la contraseña:**
1. Ve a Settings > Database
2. Haz clic en "Reset database password"
3. Copia la nueva contraseña generada
4. Úsala inmediatamente en el DATABASE_URL

---

## 📋 Checklist Final

- [ ] Obtuve la connection string desde el dashboard de Supabase
- [ ] Verifiqué que la contraseña es la de la BASE DE DATOS (no la de mi cuenta)
- [ ] Cambié `postgresql://` por `postgresql+asyncpg://`
- [ ] Configuré DATABASE_URL en Heroku
- [ ] Reinicié la app de Heroku
- [ ] Ejecuté `init_db.py` sin errores

---

## 🆘 Si Aún Falla

Si después de seguir estos pasos el error persiste, prueba:

### Opción A: Resetear la contraseña de la base de datos

```powershell
# 1. Ve a Supabase Dashboard > Settings > Database
# 2. Haz clic en "Reset database password"
# 3. Copia la nueva contraseña
# 4. Configura de nuevo con la nueva contraseña
heroku config:set DATABASE_URL="postgresql+asyncpg://postgres:[NUEVA-PASSWORD]@db.tlmdrkthueicqnvbjmie.supabase.co:5432/postgres" --app horizon-backend
```

### Opción B: Usar Heroku PostgreSQL (Plan alternativo)

Si Supabase sigue dando problemas, puedes usar el addon de Heroku:

```powershell
# Crear base de datos PostgreSQL en Heroku
heroku addons:create heroku-postgresql:essential-0 --app horizon-backend

# Heroku configurará DATABASE_URL automáticamente
# Solo necesitas modificarlo para usar asyncpg
heroku config --app horizon-backend | Select-String "DATABASE"

# Tomar el DATABASE_URL que aparece y modificarlo para usar asyncpg
# Cambiar postgresql:// por postgresql+asyncpg://
```

---

## 📝 Próximos Pasos (Una vez resuelto)

1. ✅ Crear las tablas: `heroku run python init_db.py --app horizon-backend`
2. ✅ Registrar usuario de prueba
3. ✅ Obtener JWT token
4. ✅ Configurar frontend para usar autenticación

