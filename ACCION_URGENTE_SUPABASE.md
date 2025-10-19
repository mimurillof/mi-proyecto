# ⚠️ ACCIÓN URGENTE: Obtener Contraseña Correcta de Supabase

## 🚨 Problema

La contraseña `Mikiangel29` que estás usando **NO ES CORRECTA** para la base de datos de Supabase.

Error actual:
```
OSError: [Errno 101] Network is unreachable
asyncpg.exceptions.InternalServerError: Tenant or user not found
```

## ✅ SOLUCIÓN INMEDIATA (5 minutos)

### Opción 1: Obtener la Connection String Correcta (RECOMENDADO)

**Haz esto AHORA:**

1. **Abre Supabase Dashboard:**
   - <https://supabase.com/dashboard/project/tlmdrkthueicqnvbjmie/settings/database>
   
2. **Busca la sección "Connection string":**
   - Selecciona el tab **"URI"**
   - Verás algo como:
     ```
     postgresql://postgres:[YOUR-PASSWORD]@db.tlmdrkthueicqnvbjmie.supabase.co:5432/postgres
     ```

3. **Copia la cadena EXACTA que aparece**
   - NO cambies nada todavía
   - Pega aquí la cadena completa (sin modificar): `_____________________`

### Opción 2: Resetear la Contraseña de la Base de Datos

Si la cadena dice `[YOUR-PASSWORD]` o no recuerdas la contraseña:

1. **En la misma página (Settings > Database):**
   - Busca el botón **"Reset database password"** o **"Database password"**
   - Haz clic en él

2. **Supabase generará una nueva contraseña:**
   - **CÓPIALA INMEDIATAMENTE** (no la volverás a ver)
   - Ejemplo: `kX9#mP2$qL8vN4`

3. **La nueva connection string será:**
   ```
   postgresql://postgres:[NUEVA-PASSWORD]@db.tlmdrkthueicqnvbjmie.supabase.co:5432/postgres
   ```

### Paso Final: Configurar en Heroku

**Una vez que tengas la cadena correcta**, ejecuta:

```powershell
# REEMPLAZA [TU-PASSWORD] con la contraseña real que obtuviste
heroku config:set DATABASE_URL="postgresql+asyncpg://postgres:[TU-PASSWORD]@db.tlmdrkthueicqnvbjmie.supabase.co:5432/postgres" --app horizon-backend

# Reiniciar
heroku restart --app horizon-backend

# Crear tablas
heroku run python init_db.py --app horizon-backend
```

---

## 📋 Ejemplo Completo

Si tu nueva contraseña es `kX9#mP2$qL8vN4`, ejecutarías:

```powershell
heroku config:set DATABASE_URL="postgresql+asyncpg://postgres:kX9#mP2$qL8vN4@db.tlmdrkthueicqnvbjmie.supabase.co:5432/postgres" --app horizon-backend
```

⚠️ **IMPORTANTE:** Si la contraseña tiene caracteres especiales como `@`, `#`, `$`, `&`, etc., pueden necesitar URL encoding:
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `&` → `%26`

Ejemplo con URL encoding:
```powershell
# Si tu password es "Pass@word#123"
# Debe ser: "Pass%40word%23123"
heroku config:set DATABASE_URL="postgresql+asyncpg://postgres:Pass%40word%23123@db.tlmdrkthueicqnvbjmie.supabase.co:5432/postgres" --app horizon-backend
```

---

## 🔄 Plan B: Usar Heroku PostgreSQL (Más Rápido)

Si Supabase sigue dando problemas, usa el addon de Heroku:

```powershell
# 1. Crear base de datos en Heroku (gratis para desarrollo)
heroku addons:create heroku-postgresql:essential-0 --app horizon-backend

# 2. Heroku configura DATABASE_URL automáticamente
# Ahora solo modificamos para usar asyncpg:

# 3. Ver el DATABASE_URL que Heroku creó
heroku config --app horizon-backend | Select-String "DATABASE"

# 4. Copiar ese URL y cambiar postgresql:// por postgresql+asyncpg://
# Ejemplo: si Heroku te dio:
# DATABASE_URL: postgresql://user:pass@ec2-xxx.compute-1.amazonaws.com:5432/dbname
# Configuras:
heroku config:set DATABASE_URL="postgresql+asyncpg://user:pass@ec2-xxx.compute-1.amazonaws.com:5432/dbname" --app horizon-backend

# 5. Crear tablas
heroku run python init_db.py --app horizon-backend
```

---

## ✅ Siguiente Paso

**Responde con uno de estos:**

1. "Obtuve la cadena de Supabase: `[pega aquí]`"
2. "Reseteé la contraseña, es: `[pega aquí]`"
3. "Voy a usar Heroku PostgreSQL"

Y continuo con la configuración inmediatamente.
