-- Define ENUM types first (PostgreSQL specific for better data integrity)
CREATE TYPE gender_enum AS ENUM ('male', 'female', 'other', 'prefer_not_to_say');
CREATE TYPE verification_status_enum AS ENUM ('NOT_UPLOADED', 'PENDING_REVIEW', 'VERIFIED', 'REJECTED');
CREATE TYPE document_type_enum AS ENUM ('ID_CARD', 'PASSPORT', 'DRIVERS_LICENSE', 'OTHER'); -- Tipos de documento comunes

-- Tabla para la información básica y credenciales de los usuarios
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,  -- Identificador único del usuario (auto-incremental)
    email VARCHAR(255) UNIQUE NOT NULL, -- Email del usuario, usado para login y es único
    password_hash VARCHAR(255) NOT NULL, -- Contraseña hasheada del usuario (asegúrate que 255 sea suficiente para tu algo de hash)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Fecha de creación del registro
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP -- Fecha de última actualización
);

-- Tabla para la información detallada del perfil del usuario
CREATE TABLE user_profiles (
    user_id BIGINT PRIMARY KEY, -- Llave foránea que referencia a users.id
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url VARCHAR(512), -- URL o path a la imagen de avatar
    mobile_number VARCHAR(30), -- Aumentado ligeramente por si acaso (prefijos internacionales, etc.)
    gender gender_enum, -- Usando el tipo ENUM definido arriba
    id_number VARCHAR(50), -- Número de identificación (cédula, DNI, etc.)
    tax_id_number VARCHAR(50), -- Número de identificación fiscal
    tax_id_country VARCHAR(100), -- País del ID fiscal
    residential_address TEXT,
    about_me TEXT,
    birth_date DATE, -- Fecha de nacimiento
    id_expedition_date DATE, -- Fecha de expedición del documento
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE -- Si se borra un usuario, se borra su perfil
);

-- Tabla para las configuraciones de notificaciones del usuario
CREATE TABLE user_notification_settings (
    user_id BIGINT PRIMARY KEY, -- Llave foránea que referencia a users.id
    price_limit_notifications BOOLEAN DEFAULT TRUE,
    new_report_notifications BOOLEAN DEFAULT FALSE,
    important_news_notifications BOOLEAN DEFAULT TRUE,
    event_notifications BOOLEAN DEFAULT FALSE,
    app_notifications BOOLEAN DEFAULT TRUE,
    email_notifications BOOLEAN DEFAULT TRUE,
    browser_notifications BOOLEAN DEFAULT FALSE,
    google_sync_enabled BOOLEAN DEFAULT TRUE,
    linkedin_sync_enabled BOOLEAN DEFAULT FALSE,
    facebook_sync_enabled BOOLEAN DEFAULT FALSE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabla para el estado de verificación del usuario
CREATE TABLE user_verifications (
    user_id BIGINT PRIMARY KEY, -- Llave foránea que referencia a users.id
    email_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP WITH TIME ZONE,
    phone_verified BOOLEAN DEFAULT FALSE,
    phone_verified_at TIMESTAMP WITH TIME ZONE,
    document_type document_type_enum, -- Usando el tipo ENUM definido arriba
    document_url VARCHAR(512), -- URL o path al documento cargado
    document_verification_status verification_status_enum DEFAULT 'NOT_UPLOADED', -- Usando el tipo ENUM
    document_rejection_reason TEXT, -- Razón si el documento fue rechazado
    payment_method_verified BOOLEAN DEFAULT FALSE,
    payment_method_verified_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Triggers para actualizar el campo updated_at automáticamente (Ejemplo para PostgreSQL)
-- La función se define una vez y se reutiliza para múltiples triggers.
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW(); -- o CURRENT_TIMESTAMP
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar el trigger a cada tabla que tenga la columna updated_at
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at
BEFORE UPDATE ON user_profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_notification_settings_updated_at
BEFORE UPDATE ON user_notification_settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_verifications_updated_at
BEFORE UPDATE ON user_verifications
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Índices para mejorar el rendimiento de las búsquedas
CREATE INDEX idx_users_email ON users(email);
-- Considera añadir más índices según las consultas frecuentes, por ejemplo:
-- CREATE INDEX idx_user_profiles_name ON user_profiles(last_name, first_name);
-- CREATE INDEX idx_user_verifications_status ON user_verifications(document_verification_status);

-- Comentarios finales:
-- 1. Asegúrate de que la longitud de `password_hash` (VARCHAR(255)) sea suficiente para el algoritmo de hashing que uses (e.g., bcrypt, Argon2).
-- 2. Para `avatar_url` y `document_url`, estos campos almacenarán rutas o URLs. La gestión de los archivos en sí (subida, almacenamiento) se hará en tu aplicación y sistema de archivos/storage.
-- 3. Este script es para PostgreSQL. Si usas otra base de datos (MySQL, SQL Server, SQLite), necesitarás ajustar la sintaxis para tipos de datos auto-incrementales (e.g., `AUTO_INCREMENT` en MySQL en lugar de `BIGSERIAL`), la creación de ENUMs (MySQL los tiene, SQL Server puede usar `CHECK` constraints), y la sintaxis de los triggers.

