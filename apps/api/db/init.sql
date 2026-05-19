-- 7fil.com.tr — PostgreSQL + PostGIS Init Script
-- Run once on first container start

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pg_trgm;  -- Turkish text search

-- ─── Enums ────────────────────────────────────────────────────────────────────

CREATE TYPE user_role_enum AS ENUM (
  'buyer', 'agency', 'agent_person', 'lawyer', 'bank', 'insurer', 'admin'
);

CREATE TYPE agency_plan_enum AS ENUM ('free', 'pro', 'corporate');

CREATE TYPE sub_status_enum AS ENUM ('active', 'cancelled', 'past_due', 'trialing');

CREATE TYPE property_type_enum AS ENUM (
  'residential', 'commercial', 'land', 'industrial'
);

CREATE TYPE listing_type_enum AS ENUM ('sale', 'rent');

CREATE TYPE listing_status_enum AS ENUM (
  'draft', 'active', 'passive', 'sold', 'rented', 'expired'
);

CREATE TYPE alert_channel_enum AS ENUM ('email', 'whatsapp');

CREATE TYPE certificate_status_enum AS ENUM (
  'pending', 'issued', 'expired', 'revoked'
);

-- ─── Users ────────────────────────────────────────────────────────────────────

CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email       VARCHAR(255) UNIQUE NOT NULL,
  phone       VARCHAR(20) UNIQUE,
  tc_kimlik   VARCHAR(11),
  password    VARCHAR(255) NOT NULL,
  role        user_role_enum NOT NULL DEFAULT 'buyer',
  is_verified BOOLEAN DEFAULT FALSE,
  is_active   BOOLEAN DEFAULT TRUE,
  avatar_url  TEXT,
  full_name   VARCHAR(255),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX users_email_idx ON users(email);
CREATE INDEX users_phone_idx ON users(phone);
CREATE INDEX users_role_idx ON users(role);

-- ─── KVKK Audit Log ───────────────────────────────────────────────────────────

CREATE TABLE kvkk_audit_log (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
  action      TEXT NOT NULL,
  resource    TEXT,
  ip_address  INET,
  user_agent  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX kvkk_audit_user_idx ON kvkk_audit_log(user_id);
CREATE INDEX kvkk_audit_created_idx ON kvkk_audit_log(created_at);

-- ─── Agencies ─────────────────────────────────────────────────────────────────

CREATE TABLE agencies (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID REFERENCES users(id) ON DELETE CASCADE,
  company_name VARCHAR(255) NOT NULL,
  license_no   VARCHAR(100),
  plan         agency_plan_enum DEFAULT 'free',
  subdomain    VARCHAR(100) UNIQUE,
  logo_url     TEXT,
  phone        VARCHAR(20),
  address      TEXT,
  city         VARCHAR(100),
  description  TEXT,
  is_verified  BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX agencies_user_idx ON agencies(user_id);
CREATE INDEX agencies_subdomain_idx ON agencies(subdomain);

-- ─── Subscriptions ────────────────────────────────────────────────────────────

CREATE TABLE subscriptions (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id      UUID REFERENCES agencies(id) ON DELETE CASCADE,
  plan           agency_plan_enum NOT NULL,
  status         sub_status_enum DEFAULT 'active',
  iyzico_sub_id  TEXT,
  amount         DECIMAL(10,2),
  currency       VARCHAR(3) DEFAULT 'TRY',
  starts_at      TIMESTAMPTZ NOT NULL,
  ends_at        TIMESTAMPTZ,
  trial_ends_at  TIMESTAMPTZ,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- ─── Listings (Core — PostGIS) ────────────────────────────────────────────────

CREATE TABLE listings (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id       UUID REFERENCES agencies(id) ON DELETE SET NULL,
  owner_user_id   UUID REFERENCES users(id) ON DELETE CASCADE,
  title           VARCHAR(500) NOT NULL,
  description     TEXT,
  price           DECIMAL(14,2),
  currency        VARCHAR(3) DEFAULT 'TRY',
  property_type   property_type_enum NOT NULL,
  listing_type    listing_type_enum NOT NULL,
  category        VARCHAR(100),
  status          listing_status_enum DEFAULT 'draft',

  -- Location (PostGIS)
  coordinates     GEOGRAPHY(POINT, 4326),
  address_text    TEXT,
  city            VARCHAR(100) NOT NULL,
  district        VARCHAR(100),
  neighborhood    VARCHAR(100),

  -- Residential specs
  area_m2         DECIMAL(10,2),
  room_count      VARCHAR(20),
  floor_no        INTEGER,
  total_floors    INTEGER,
  building_age    INTEGER,
  is_furnished    BOOLEAN,
  has_parking     BOOLEAN DEFAULT FALSE,
  has_elevator    BOOLEAN DEFAULT FALSE,
  has_balcony     BOOLEAN DEFAULT FALSE,
  has_garden      BOOLEAN DEFAULT FALSE,
  has_pool        BOOLEAN DEFAULT FALSE,

  -- WhatsApp
  whatsapp_link   TEXT,
  whatsapp_qr_url TEXT,

  -- AI / FILTERRA
  ai_description  TEXT,
  valuation_min   DECIMAL(14,2),
  valuation_max   DECIMAL(14,2),
  legal_risk_score SMALLINT,

  -- Stats
  view_count       INTEGER DEFAULT 0,
  whatsapp_clicks  INTEGER DEFAULT 0,
  favorite_count   INTEGER DEFAULT 0,

  -- Timing
  expires_at      TIMESTAMPTZ,
  published_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Spatial index (critical for map/radius search)
CREATE INDEX listings_geo_idx       ON listings USING GIST(coordinates);
CREATE INDEX listings_city_idx      ON listings(city, district, neighborhood);
CREATE INDEX listings_status_idx    ON listings(status);
CREATE INDEX listings_type_idx      ON listings(property_type, listing_type);
CREATE INDEX listings_price_idx     ON listings(price);
CREATE INDEX listings_agency_idx    ON listings(agency_id);
CREATE INDEX listings_created_idx   ON listings(created_at DESC);

-- Full-text search (Turkish)
CREATE INDEX listings_fts_idx ON listings
  USING gin(to_tsvector('turkish', title || ' ' || COALESCE(description, '')));

-- ─── Listing Photos ───────────────────────────────────────────────────────────

CREATE TABLE listing_photos (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id  UUID REFERENCES listings(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  r2_key      TEXT NOT NULL,
  sort_order  INTEGER DEFAULT 0,
  is_cover    BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX listing_photos_listing_idx ON listing_photos(listing_id);

-- ─── Favorites ────────────────────────────────────────────────────────────────

CREATE TABLE favorites (
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, listing_id)
);

CREATE INDEX favorites_user_idx ON favorites(user_id);

-- ─── Search Alerts ────────────────────────────────────────────────────────────

CREATE TABLE search_alerts (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  filters    JSONB NOT NULL,
  channel    alert_channel_enum DEFAULT 'email',
  is_active  BOOLEAN DEFAULT TRUE,
  last_sent  TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── WhatsApp Click Tracking ──────────────────────────────────────────────────

CREATE TABLE whatsapp_clicks (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id UUID REFERENCES listings(id) ON DELETE CASCADE,
  user_id    UUID REFERENCES users(id) ON DELETE SET NULL,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX wa_clicks_listing_idx ON whatsapp_clicks(listing_id);

-- ─── Trigger: updated_at auto-update ─────────────────────────────────────────

CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER agencies_updated_at BEFORE UPDATE ON agencies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER listings_updated_at BEFORE UPDATE ON listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
