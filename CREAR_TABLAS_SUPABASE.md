# 🗄️ Script SQL: Crear Tablas para Autenticación

## 📋 Instrucciones

1. Ve a Supabase Dashboard: https://supabase.com/dashboard/project/tlmdrkthueicqnvbjmie/editor
2. Haz clic en **"SQL Editor"** en el menú lateral
3. Copia y pega el siguiente script SQL
4. Haz clic en **"Run"** para ejecutarlo

---

## 🛠️ Script SQL

```sql
-- ===================================================================
-- PASO 1: Eliminar tablas existentes si hay conflictos
-- ===================================================================
DROP TABLE IF EXISTS user_verifications CASCADE;
DROP TABLE IF EXISTS user_notification_settings CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Eliminar tipos enum si existen
DROP TYPE IF EXISTS genderenum CASCADE;
DROP TYPE IF EXISTS verificationstatusenum CASCADE;
DROP TYPE IF EXISTS documenttypeenum CASCADE;

-- ===================================================================
-- PASO 2: Crear tipos ENUM
-- ===================================================================
CREATE TYPE genderenum AS ENUM ('male', 'female', 'other', 'prefer_not_to_say');
CREATE TYPE verificationstatusenum AS ENUM ('NOT_UPLOADED', 'PENDING_REVIEW', 'VERIFIED', 'REJECTED');
CREATE TYPE documenttypeenum AS ENUM ('ID_CARD', 'PASSPORT', 'DRIVERS_LICENSE', 'OTHER');

-- ===================================================================
-- PASO 3: Crear tabla USERS (tabla principal)
-- ===================================================================
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para búsquedas rápidas por email
CREATE INDEX idx_users_email ON users(email);

-- ===================================================================
-- PASO 4: Crear tabla USER_PROFILES
-- ===================================================================
CREATE TABLE user_profiles (
    user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url VARCHAR(512),
    mobile_number VARCHAR(30),
    gender genderenum,
    id_number VARCHAR(50),
    tax_id_number VARCHAR(50),
    tax_id_country VARCHAR(100),
    residential_address TEXT,
    about_me TEXT,
    birth_date DATE,
    id_expedition_date DATE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================================================
-- PASO 5: Crear tabla USER_NOTIFICATION_SETTINGS
-- ===================================================================
CREATE TABLE user_notification_settings (
    user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    email_notifications BOOLEAN DEFAULT TRUE,
    push_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT FALSE,
    marketing_emails BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================================================
-- PASO 6: Crear tabla USER_VERIFICATIONS
-- ===================================================================
CREATE TABLE user_verifications (
    user_id BIGINT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    id_document_type documenttypeenum,
    id_document_front_url VARCHAR(512),
    id_document_back_url VARCHAR(512),
    tax_id_document_url VARCHAR(512),
    residential_proof_url VARCHAR(512),
    verification_status verificationstatusenum DEFAULT 'NOT_UPLOADED',
    has_completed_onboarding BOOLEAN DEFAULT FALSE,
    verification_notes TEXT,
    verification_date TIMESTAMP WITH TIME ZONE,
    rejection_reason TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===================================================================
-- PASO 7: Verificar que todo se creó correctamente
-- ===================================================================
SELECT 'Tablas creadas exitosamente!' AS status;

-- Ver todas las tablas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'user_profiles', 'user_notification_settings', 'user_verifications')
ORDER BY table_name;
```

---

## ✅ Resultado Esperado

Deberías ver:

```
status: "Tablas creadas exitosamente!"

table_name
--------------------------
user_notification_settings
user_profiles
users
user_verifications
```

---

## 🚀 Siguiente Paso

Una vez que ejecutes este script y veas el mensaje de éxito, avísame para continuar con:

1. ✅ Registrar usuario de prueba
2. ✅ Obtener JWT token
3. ✅ Configurar frontend con autenticación

---

## ⚠️ Si hay errores

Si ves algún error al ejecutar el script, cópiame el mensaje completo de error y lo resolveremos.
