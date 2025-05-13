-- Define ENUM types first (PostgreSQL specific for better data integrity)
CREATE TYPE gender_enum AS ENUM ('male', 'female', 'other', 'prefer_not_to_say');
CREATE TYPE verification_status_enum AS ENUM ('NOT_UPLOADED', 'PENDING_REVIEW', 'VERIFIED', 'REJECTED');
CREATE TYPE document_type_enum AS ENUM ('ID_CARD', 'PASSPORT', 'DRIVERS_LICENSE', 'OTHER');

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE user_profiles (
    user_id BIGINT PRIMARY KEY,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url VARCHAR(512),
    mobile_number VARCHAR(30),
    gender gender_enum,
    id_number VARCHAR(50),
    tax_id_number VARCHAR(50),
    tax_id_country VARCHAR(100),
    residential_address TEXT,
    about_me TEXT,
    birth_date DATE,
    id_expedition_date DATE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE user_notification_settings (
    user_id BIGINT PRIMARY KEY,
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

CREATE TABLE user_verifications (
    user_id BIGINT PRIMARY KEY,
    email_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP WITH TIME ZONE,
    phone_verified BOOLEAN DEFAULT FALSE,
    phone_verified_at TIMESTAMP WITH TIME ZONE,
    document_type document_type_enum,
    document_url VARCHAR(512),
    document_verification_status verification_status_enum DEFAULT 'NOT_UPLOADED',
    document_rejection_reason TEXT,
    payment_method_verified BOOLEAN DEFAULT FALSE,
    payment_method_verified_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

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

CREATE INDEX idx_users_email ON users(email);

