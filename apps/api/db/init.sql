-- 7fil.com.tr — PostgreSQL + PostGIS Init Script
-- Run once on first container start

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS pg_trgm;  -- Turkish text search

-- ─── Enums ────────────────────────────────────────────────────────────────────

CREATE TYPE user_role_enum AS ENUM (
  'buyer', 'agency', 'agent_person', 'lawyer', 'bank', 'insurer', 'partner', 'admin'
);

CREATE TYPE agency_plan_enum AS ENUM ('free', 'pro', 'corporate', 'enterprise');

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

-- ─── FILTERRA.AI Reports ──────────────────────────────────────────────────────

CREATE TYPE filterra_agent_enum AS ENUM (
  'listing_writer', 'title_optimizer', 'valuation',
  'legal_precheck', 'neighborhood', 'market_trend',
  'photo_description', 'translation'
);

CREATE TABLE filterra_reports (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id    UUID REFERENCES listings(id) ON DELETE CASCADE,
  user_id       UUID REFERENCES users(id) ON DELETE SET NULL,
  agent         filterra_agent_enum NOT NULL,
  input_data    JSONB,
  output_data   JSONB,
  model_id      VARCHAR(100),
  tokens_used   INTEGER,
  duration_ms   INTEGER,
  error         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX filterra_listing_idx ON filterra_reports(listing_id);
CREATE INDEX filterra_agent_idx   ON filterra_reports(agent);
CREATE INDEX filterra_created_idx ON filterra_reports(created_at DESC);

-- ─── Module 9: Hukuki Doğrulama ──────────────────────────────────────────────

CREATE TYPE legal_case_status_enum AS ENUM (
  'pending', 'under_review', 'approved', 'rejected', 'cancelled'
);

CREATE TYPE doc_type_enum AS ENUM (
  'tapu', 'iskan', 'ruhsat', 'kadastro', 'vekaletname', 'dask', 'ipotek', 'other'
);

CREATE TABLE legal_cases (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id    UUID REFERENCES listings(id) ON DELETE CASCADE,
  requester_id  UUID REFERENCES users(id) ON DELETE SET NULL,
  lawyer_id     UUID REFERENCES users(id) ON DELETE SET NULL,
  status        legal_case_status_enum DEFAULT 'pending',
  risk_score    SMALLINT,
  risk_notes    TEXT,
  lawyer_notes  TEXT,
  fee           DECIMAL(10,2),
  currency      VARCHAR(3) DEFAULT 'TRY',
  reviewed_at   TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX legal_cases_listing_idx  ON legal_cases(listing_id);
CREATE INDEX legal_cases_lawyer_idx   ON legal_cases(lawyer_id);
CREATE INDEX legal_cases_status_idx   ON legal_cases(status);
CREATE INDEX legal_cases_created_idx  ON legal_cases(created_at DESC);

CREATE TABLE legal_documents (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id     UUID REFERENCES legal_cases(id) ON DELETE CASCADE,
  uploader_id UUID REFERENCES users(id) ON DELETE SET NULL,
  doc_type    doc_type_enum NOT NULL,
  file_url    TEXT NOT NULL,
  r2_key      TEXT NOT NULL,
  notes       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX legal_docs_case_idx ON legal_documents(case_id);

CREATE TABLE property_certificates (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id   UUID REFERENCES listings(id) ON DELETE CASCADE,
  case_id      UUID REFERENCES legal_cases(id) ON DELETE SET NULL,
  issued_by    UUID REFERENCES users(id) ON DELETE SET NULL,
  cert_hash    VARCHAR(64) NOT NULL UNIQUE,
  status       certificate_status_enum DEFAULT 'issued',
  valid_until  TIMESTAMPTZ,
  revoke_reason TEXT,
  issued_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX cert_listing_active_idx ON property_certificates(listing_id)
  WHERE status = 'issued';
CREATE INDEX cert_hash_idx ON property_certificates(cert_hash);

CREATE TRIGGER legal_cases_updated_at BEFORE UPDATE ON legal_cases
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Module 10: Finans & Sigorta ─────────────────────────────────────────────

CREATE TYPE loan_type_enum AS ENUM ('conventional', 'islamic');
CREATE TYPE lead_status_enum AS ENUM ('new', 'contacted', 'qualified', 'rejected', 'converted');
CREATE TYPE insurance_type_enum AS ENUM ('dask', 'konut', 'both');
CREATE TYPE quote_status_enum AS ENUM ('draft', 'sent', 'accepted', 'expired');
CREATE TYPE payment_status_enum AS ENUM ('pending', 'success', 'failed', 'refunded');

CREATE TABLE mortgage_leads (
  id               UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id       UUID REFERENCES listings(id) ON DELETE SET NULL,
  user_id          UUID REFERENCES users(id) ON DELETE SET NULL,
  bank_user_id     UUID REFERENCES users(id) ON DELETE SET NULL,
  loan_type        loan_type_enum DEFAULT 'conventional',
  property_price   DECIMAL(14,2) NOT NULL,
  down_payment     DECIMAL(14,2) NOT NULL,
  loan_amount      DECIMAL(14,2) NOT NULL,
  loan_term_years  SMALLINT NOT NULL,
  interest_rate    DECIMAL(5,2),
  monthly_payment  DECIMAL(10,2),
  ltv_ratio        DECIMAL(5,2),
  status           lead_status_enum DEFAULT 'new',
  contact_name     VARCHAR(255),
  contact_phone    VARCHAR(20),
  contact_email    VARCHAR(255),
  city             VARCHAR(100),
  property_type    property_type_enum,
  is_first_home    BOOLEAN DEFAULT TRUE,
  notes            TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX mortgage_leads_listing_idx  ON mortgage_leads(listing_id);
CREATE INDEX mortgage_leads_bank_idx     ON mortgage_leads(bank_user_id);
CREATE INDEX mortgage_leads_status_idx   ON mortgage_leads(status);
CREATE INDEX mortgage_leads_created_idx  ON mortgage_leads(created_at DESC);

CREATE TABLE insurance_quotes (
  id                 UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id         UUID REFERENCES listings(id) ON DELETE SET NULL,
  user_id            UUID REFERENCES users(id) ON DELETE SET NULL,
  insurance_type     insurance_type_enum NOT NULL,
  area_m2            DECIMAL(10,2),
  building_age       INTEGER,
  city               VARCHAR(100),
  district           VARCHAR(100),
  construction_type  VARCHAR(50) DEFAULT 'betonarme',
  floor_count        INTEGER,
  dask_premium       DECIMAL(10,2),
  konut_premium      DECIMAL(10,2),
  dask_coverage      DECIMAL(14,2),
  status             quote_status_enum DEFAULT 'draft',
  valid_until        TIMESTAMPTZ,
  contact_email      VARCHAR(255),
  created_at         TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX insurance_quotes_listing_idx ON insurance_quotes(listing_id);
CREATE INDEX insurance_quotes_user_idx    ON insurance_quotes(user_id);

CREATE TABLE payment_orders (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id      UUID REFERENCES agencies(id) ON DELETE CASCADE,
  user_id        UUID REFERENCES users(id) ON DELETE SET NULL,
  plan           VARCHAR(20) NOT NULL,
  months         INTEGER DEFAULT 1,
  amount         DECIMAL(10,2) NOT NULL,
  currency       VARCHAR(3) DEFAULT 'TRY',
  iyzico_token   TEXT,
  iyzico_ref     TEXT UNIQUE,
  status         payment_status_enum DEFAULT 'pending',
  error_msg      TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX payment_orders_agency_idx  ON payment_orders(agency_id);
CREATE INDEX payment_orders_status_idx  ON payment_orders(status);

CREATE TABLE iyzico_webhooks (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type    VARCHAR(100) NOT NULL,
  iyzi_reference TEXT,
  payload       JSONB NOT NULL,
  processed     BOOLEAN DEFAULT FALSE,
  error         TEXT,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX iyzico_webhooks_event_idx ON iyzico_webhooks(event_type);
CREATE INDEX iyzico_webhooks_proc_idx  ON iyzico_webhooks(processed);

CREATE TRIGGER mortgage_leads_updated_at BEFORE UPDATE ON mortgage_leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Module 11: TicariMetre ───────────────────────────────────────────────────

CREATE TABLE ticari_reports (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID REFERENCES users(id) ON DELETE SET NULL,
  listing_id    UUID REFERENCES listings(id) ON DELETE SET NULL,
  report_type   VARCHAR(50) NOT NULL,
  input_data    JSONB,
  result_data   JSONB,
  title         VARCHAR(255),
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX ticari_reports_user_idx    ON ticari_reports(user_id);
CREATE INDEX ticari_reports_listing_idx ON ticari_reports(listing_id);
CREATE INDEX ticari_reports_type_idx    ON ticari_reports(report_type);

CREATE TABLE ticari_market_snapshots (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  city           VARCHAR(100) NOT NULL,
  district       VARCHAR(100),
  property_type  property_type_enum NOT NULL,
  listing_type   listing_type_enum NOT NULL,
  avg_price_m2   DECIMAL(14,2),
  median_price   DECIMAL(14,2),
  min_price_m2   DECIMAL(14,2),
  max_price_m2   DECIMAL(14,2),
  listing_count  INTEGER,
  sample_date    DATE NOT NULL,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE UNIQUE INDEX ticari_snapshot_uniq ON ticari_market_snapshots(
  city, COALESCE(district, ''), property_type, listing_type, sample_date
);
CREATE INDEX ticari_snapshot_city_idx ON ticari_market_snapshots(city, property_type);

-- ─── Module 12: White-Label / SaaS Brand Builder ─────────────────────────────

CREATE TABLE agency_branding (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id            UUID REFERENCES agencies(id) ON DELETE CASCADE UNIQUE,
  logo_url             TEXT,
  logo_r2_key          TEXT,
  favicon_url          TEXT,
  primary_color        VARCHAR(7) DEFAULT '#1B3A4B',
  secondary_color      VARCHAR(7) DEFAULT '#C9A84C',
  font_family          VARCHAR(100) DEFAULT 'Inter',
  hero_title           VARCHAR(255),
  hero_subtitle        TEXT,
  about_text           TEXT,
  contact_phone        VARCHAR(20),
  contact_email        VARCHAR(255),
  contact_address      TEXT,
  instagram_url        TEXT,
  facebook_url         TEXT,
  twitter_url          TEXT,
  linkedin_url         TEXT,
  youtube_url          TEXT,
  custom_css           TEXT,
  seo_title            VARCHAR(255),
  seo_description      TEXT,
  custom_domain        VARCHAR(255),
  domain_verified      BOOLEAN DEFAULT FALSE,
  domain_verify_token  VARCHAR(64),
  show_7fil_badge      BOOLEAN DEFAULT TRUE,
  listings_per_page    SMALLINT DEFAULT 12,
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX agency_branding_agency_idx   ON agency_branding(agency_id);
CREATE INDEX agency_branding_domain_idx   ON agency_branding(custom_domain)
  WHERE custom_domain IS NOT NULL;

CREATE TRIGGER agency_branding_updated_at BEFORE UPDATE ON agency_branding
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Module 15-A: Auction System ─────────────────────────────────────────────

CREATE TYPE auction_status_enum AS ENUM ('scheduled','active','ended','cancelled');

CREATE TABLE auctions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  listing_id      UUID REFERENCES listings(id) ON DELETE CASCADE UNIQUE,
  agency_id       UUID REFERENCES agencies(id) ON DELETE SET NULL,
  title           VARCHAR(500) NOT NULL,
  description     TEXT,
  start_price     DECIMAL(14,2) NOT NULL,
  reserve_price   DECIMAL(14,2),
  min_increment   DECIMAL(14,2) NOT NULL DEFAULT 1000,
  buy_now_price   DECIMAL(14,2),
  current_price   DECIMAL(14,2),
  bid_count       INTEGER DEFAULT 0,
  status          auction_status_enum DEFAULT 'scheduled',
  starts_at       TIMESTAMPTZ NOT NULL,
  ends_at         TIMESTAMPTZ NOT NULL,
  winner_user_id  UUID REFERENCES users(id) ON DELETE SET NULL,
  winner_bid_id   UUID,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE auction_bids (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auction_id  UUID REFERENCES auctions(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  amount      DECIMAL(14,2) NOT NULL,
  is_auto     BOOLEAN DEFAULT FALSE,
  ip_address  INET,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX auctions_status_idx    ON auctions(status, ends_at);
CREATE INDEX auctions_agency_idx    ON auctions(agency_id);
CREATE INDEX auction_bids_auction_idx ON auction_bids(auction_id, amount DESC);
CREATE INDEX auction_bids_user_idx  ON auction_bids(user_id);

CREATE TRIGGER auctions_updated_at BEFORE UPDATE ON auctions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Module 15-B: International Listings ─────────────────────────────────────

ALTER TABLE listings ADD COLUMN IF NOT EXISTS
  country VARCHAR(2) NOT NULL DEFAULT 'TR';

CREATE INDEX listings_country_idx ON listings(country, city);

-- ─── Module 15-C: Atlas AI Conversations ─────────────────────────────────────

CREATE TABLE atlas_conversations (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  session_id VARCHAR(64),
  title      VARCHAR(255),
  context    JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE atlas_messages (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES atlas_conversations(id) ON DELETE CASCADE,
  role            VARCHAR(20) NOT NULL CHECK (role IN ('user','assistant','system')),
  content         TEXT NOT NULL,
  tokens_used     INTEGER,
  model           VARCHAR(60),
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX atlas_conv_user_idx ON atlas_conversations(user_id, created_at DESC);
CREATE INDEX atlas_msg_conv_idx  ON atlas_messages(conversation_id, created_at ASC);

CREATE TRIGGER atlas_conv_updated_at BEFORE UPDATE ON atlas_conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Module 16: Password Reset Tokens ────────────────────────────────────────

CREATE TABLE password_reset_tokens (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(64) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at    TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX prt_token_hash_idx ON password_reset_tokens(token_hash);
CREATE INDEX prt_user_idx ON password_reset_tokens(user_id);

-- ─── Module 17: Email Verification Tokens ────────────────────────────────────

CREATE TABLE email_verification_tokens (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(64) NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at    TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX evt_token_hash_idx ON email_verification_tokens(token_hash);
CREATE INDEX evt_user_idx ON email_verification_tokens(user_id);

-- ─── Module 16: Push Notification Tokens ─────────────────────────────────────

CREATE TABLE push_tokens (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID REFERENCES users(id) ON DELETE CASCADE,
  token      TEXT NOT NULL,
  platform   VARCHAR(10) NOT NULL CHECK (platform IN ('ios','android','web')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, token)
);

CREATE INDEX push_tokens_user_idx ON push_tokens(user_id);

-- ─── Module 19: Payment Orders update (months column) ─────────────────────────
-- ALTER TABLE payment_orders ADD COLUMN IF NOT EXISTS months INTEGER DEFAULT 1;
-- (Handled in entity; apply on existing DBs with migration)

-- ─── Module 20: Partner Portal ────────────────────────────────────────────────

CREATE TYPE partner_ref_type  AS ENUM ('listing_lead','mortgage_lead','agency_signup');
CREATE TYPE partner_ref_status AS ENUM ('pending','contacted','converted','rejected');
CREATE TYPE commission_status  AS ENUM ('pending','approved','paid','cancelled');

CREATE TABLE partner_referrals (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id      UUID REFERENCES users(id) ON DELETE CASCADE,
  agency_id       UUID REFERENCES agencies(id) ON DELETE SET NULL,
  ref_type        partner_ref_type NOT NULL,
  status          partner_ref_status DEFAULT 'pending',
  contact_name    VARCHAR(200) NOT NULL,
  contact_email   VARCHAR(200) NOT NULL,
  contact_phone   VARCHAR(30),
  notes           TEXT,
  estimated_value DECIMAL(14,2),
  converted_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE partner_commissions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id      UUID REFERENCES users(id) ON DELETE CASCADE,
  referral_id     UUID REFERENCES partner_referrals(id) ON DELETE SET NULL,
  commission_type VARCHAR(50) NOT NULL,
  amount          DECIMAL(12,2) NOT NULL,
  currency        VARCHAR(3) DEFAULT 'TRY',
  status          commission_status DEFAULT 'pending',
  paid_at         TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE partner_api_keys (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id  UUID REFERENCES users(id) ON DELETE CASCADE,
  name        VARCHAR(100) NOT NULL,
  key_prefix  VARCHAR(20) NOT NULL,
  key_hash    VARCHAR(64) NOT NULL,
  last_used_at TIMESTAMPTZ,
  expires_at  TIMESTAMPTZ,
  revoked_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX partner_referrals_partner_idx ON partner_referrals(partner_id);
CREATE INDEX partner_commissions_partner_idx ON partner_commissions(partner_id);
CREATE INDEX partner_api_keys_partner_idx ON partner_api_keys(partner_id);

-- ─── Module B: MLS — Emlakçılar Arası Portföy Paylaşım Sistemi ───────────────
--
-- Üç katmanlı yapı:
--   1. mls_listings        → Yetkili emlakçının komisyon paylaşımına açtığı ilan
--   2. mls_collaborations  → İşbirlikçi emlakçıların başvuru ve onay kayıtları
--   3. mls_commission_splits → İşlem kapandığında komisyon dağıtım defteri
--
-- İş kuralı kısıtları:
--   • authorized_agent_share + collaborator_share = 100  (CHECK)
--   • Bir ilan aynı anda yalnızca bir aktif MLS kaydına sahip olabilir
--     (PARTIAL UNIQUE INDEX: status IN ('open','in_progress'))
--   • Aynı emlakçı aynı MLS ilanına ikinci kez başvuramaz
--     (UNIQUE: mls_listing_id + collaborator_agent_id, kısmi — aktif olanlar)
-- ─────────────────────────────────────────────────────────────────────────────

-- Enum: MLS ilan durumu
CREATE TYPE mls_status_enum AS ENUM (
  'open',         -- Paylaşıma açık, başvuru alınıyor
  'in_progress',  -- En az bir işbirlikçi onaylandı, süreç başladı
  'closed',       -- Satış/kiralama tamamlandı
  'cancelled'     -- Yetkili emlakçı iptal etti
);

-- Enum: Komisyon tipi
CREATE TYPE commission_type_enum AS ENUM (
  'percentage',  -- Yüzde bazlı (ör. %3.5)
  'fixed_try'    -- Sabit TL tutarı
);

-- Enum: İşbirliği başvuru durumu
CREATE TYPE collaboration_status_enum AS ENUM (
  'pending',    -- Başvuru yapıldı, henüz değerlendirilmedi
  'approved',   -- Yetkili emlakçı onayladı
  'rejected',   -- Yetkili emlakçı reddetti
  'withdrawn',  -- İşbirlikçi çekildi veya MLS iptal edildi
  'completed'   -- Bu işbirlikçi üzerinden işlem tamamlandı
);

-- Enum: Komisyon split durumu
CREATE TYPE split_status_enum AS ENUM (
  'calculated', -- Hesaplandı, ödeme bekleniyor
  'approved',   -- Platform onayladı
  'paid',       -- Ödeme yapıldı
  'disputed'    -- İtiraz — avukat paneline düştü
);

-- ── Tablo 1: mls_listings ────────────────────────────────────────────────────

CREATE TABLE mls_listings (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- İlan referansı
  listing_id              UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,

  -- Yetkili emlakçı
  authorized_agent_id     UUID NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
  authorized_agency_id    UUID          REFERENCES agencies(id) ON DELETE SET NULL,

  -- Komisyon yapısı
  commission_type         commission_type_enum NOT NULL DEFAULT 'percentage',
  total_commission_value  DECIMAL(8,2)  NOT NULL,
  authorized_agent_share  SMALLINT      NOT NULL DEFAULT 50,
  collaborator_share      SMALLINT      NOT NULL DEFAULT 50,

  -- İş kuralı: payların toplamı her zaman 100 olmalı
  CONSTRAINT chk_shares_sum CHECK (authorized_agent_share + collaborator_share = 100),
  -- İş kuralı: yüzde bazlı komisyon 100'ü geçemez
  CONSTRAINT chk_commission_pct CHECK (
    commission_type = 'fixed_try' OR total_commission_value <= 100
  ),

  -- Kısıtlar ve kurallar
  status                  mls_status_enum NOT NULL DEFAULT 'open',
  region_filter           VARCHAR(100),          -- NULL → Türkiye geneli
  max_collaborators       SMALLINT NOT NULL DEFAULT 10,
  expires_at              TIMESTAMPTZ,

  -- Notlar
  agent_notes             TEXT,

  -- Zaman damgaları
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ DEFAULT NOW()
);

-- Bir ilan aynı anda yalnızca bir aktif MLS kaydına sahip olabilir
CREATE UNIQUE INDEX mls_listings_active_uniq
  ON mls_listings(listing_id)
  WHERE status IN ('open', 'in_progress');

-- Performans index'leri
CREATE INDEX mls_listings_status_idx         ON mls_listings(status, created_at DESC);
CREATE INDEX mls_listings_authorized_idx     ON mls_listings(authorized_agent_id);
CREATE INDEX mls_listings_agency_idx         ON mls_listings(authorized_agency_id);
CREATE INDEX mls_listings_region_idx         ON mls_listings(region_filter)
  WHERE region_filter IS NOT NULL;
CREATE INDEX mls_listings_expires_idx        ON mls_listings(expires_at)
  WHERE expires_at IS NOT NULL;

CREATE TRIGGER mls_listings_updated_at BEFORE UPDATE ON mls_listings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Tablo 2: mls_collaborations ──────────────────────────────────────────────

CREATE TABLE mls_collaborations (
  id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- MLS ilan referansı
  mls_listing_id          UUID NOT NULL REFERENCES mls_listings(id) ON DELETE CASCADE,

  -- İşbirlikçi emlakçı
  collaborator_agent_id   UUID NOT NULL REFERENCES users(id)    ON DELETE CASCADE,
  collaborator_agency_id  UUID          REFERENCES agencies(id) ON DELETE SET NULL,

  -- Durum
  status                  collaboration_status_enum NOT NULL DEFAULT 'pending',

  -- Müşteri referans notu (KVKK uyumlu kısmi bilgi)
  client_ref_note         TEXT,

  -- Zaman damgaları
  reviewed_at             TIMESTAMPTZ,
  completed_at            TIMESTAMPTZ,
  created_at              TIMESTAMPTZ DEFAULT NOW(),
  updated_at              TIMESTAMPTZ DEFAULT NOW()
);

-- Aynı emlakçı aynı ilana aktif olarak iki kez başvuramaz
CREATE UNIQUE INDEX mls_collab_active_uniq
  ON mls_collaborations(mls_listing_id, collaborator_agent_id)
  WHERE status NOT IN ('rejected', 'withdrawn');

-- Performans index'leri
CREATE INDEX mls_collab_mls_listing_idx     ON mls_collaborations(mls_listing_id);
CREATE INDEX mls_collab_agent_idx           ON mls_collaborations(collaborator_agent_id);
CREATE INDEX mls_collab_status_idx          ON mls_collaborations(status);
CREATE INDEX mls_collab_agency_idx          ON mls_collaborations(collaborator_agency_id)
  WHERE collaborator_agency_id IS NOT NULL;

CREATE TRIGGER mls_collaborations_updated_at BEFORE UPDATE ON mls_collaborations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Tablo 3: mls_commission_splits ──────────────────────────────────────────

CREATE TABLE mls_commission_splits (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- İşbirliği referansı
  collaboration_id    UUID NOT NULL REFERENCES mls_collaborations(id) ON DELETE CASCADE,

  -- Alıcı
  recipient_user_id   UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  is_authorized_agent BOOLEAN NOT NULL,  -- TRUE → yetkili, FALSE → işbirlikçi

  -- Tutar
  amount_try          DECIMAL(12,2) NOT NULL,
  percentage_share    SMALLINT     NOT NULL,

  -- Durum & ödeme
  status              split_status_enum NOT NULL DEFAULT 'calculated',
  payment_ref         VARCHAR(255),       -- İyzico / havale ref no
  paid_at             TIMESTAMPTZ,
  dispute_note        TEXT,

  -- Zaman damgaları
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Bir işbirliği başına yalnızca iki split kaydı olabilir (authorized + collaborator)
CREATE UNIQUE INDEX mls_split_role_uniq
  ON mls_commission_splits(collaboration_id, is_authorized_agent);

-- Performans index'leri
CREATE INDEX mls_split_collab_idx     ON mls_commission_splits(collaboration_id);
CREATE INDEX mls_split_recipient_idx  ON mls_commission_splits(recipient_user_id);
CREATE INDEX mls_split_status_idx     ON mls_commission_splits(status);

CREATE TRIGGER mls_commission_splits_updated_at BEFORE UPDATE ON mls_commission_splits
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ── Görünüm: mls_pool_view ───────────────────────────────────────────────────
-- Partner portalı için hazır, join'siz sorgu yapısı

CREATE OR REPLACE VIEW mls_pool_view AS
SELECT
  ml.id                     AS mls_id,
  ml.status                 AS mls_status,
  ml.commission_type,
  ml.total_commission_value,
  ml.authorized_agent_share,
  ml.collaborator_share,
  ml.max_collaborators,
  ml.region_filter,
  ml.expires_at,
  ml.agent_notes,
  ml.created_at             AS mls_created_at,
  -- İlan bilgileri
  l.id                      AS listing_id,
  l.title,
  l.city,
  l.district,
  l.neighborhood,
  l.property_type,
  l.listing_type,
  l.price,
  l.currency,
  l.area_m2,
  l.room_count,
  -- Kapak fotoğrafı
  (
    SELECT lp.url FROM listing_photos lp
    WHERE lp.listing_id = l.id AND lp.is_cover = TRUE
    LIMIT 1
  ) AS cover_url,
  -- Onaylı işbirlikçi sayısı
  (
    SELECT COUNT(*) FROM mls_collaborations mc
    WHERE mc.mls_listing_id = ml.id AND mc.status = 'approved'
  ) AS approved_collaborator_count,
  -- Yetkili ajans
  a.company_name            AS authorized_agency_name,
  a.logo_url                AS authorized_agency_logo
FROM mls_listings ml
JOIN listings l ON l.id = ml.listing_id
LEFT JOIN agencies a ON a.id = ml.authorized_agency_id
WHERE ml.status IN ('open', 'in_progress');

COMMENT ON VIEW mls_pool_view IS
  'Partner portalı MLS havuzu: açık ve devam eden ilanları ilan detayıyla birlikte gösterir.';

-- =============================================================================
-- M-01 — CRM: Lead Yönetimi & Aktivite Geçmişi
-- =============================================================================

-- ─── Enum'lar ─────────────────────────────────────────────────────────────────

DO $$ BEGIN
  CREATE TYPE lead_source_enum AS ENUM (
    'website','phone','whatsapp','referral','social_media','portal','walk_in','email','other'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE lead_status_enum AS ENUM (
    'new','contacted','qualified','showing','offer','negotiation','won','lost','nurturing'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE lead_type_enum AS ENUM (
    'buyer','renter','seller','landlord','investor'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE lead_priority_enum AS ENUM (
    'low','medium','high','hot'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE activity_type_enum AS ENUM (
    'note','call','email_sent','whatsapp','meeting','showing',
    'offer_sent','status_change','ai_action'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ─── Leads tablosu ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS leads (
  id                  UUID              DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Sahiplik
  agency_id           UUID              NOT NULL
                        REFERENCES agencies(id) ON DELETE CASCADE,
  assigned_agent_id   UUID
                        REFERENCES users(id) ON DELETE SET NULL,

  -- Müşteri bilgileri
  first_name          VARCHAR(100)      NOT NULL,
  last_name           VARCHAR(100)      NOT NULL,
  phone               VARCHAR(20),
  email               VARCHAR(200),

  -- CRM durumu
  source              lead_source_enum   NOT NULL DEFAULT 'website',
  status              lead_status_enum   NOT NULL DEFAULT 'new',
  type                lead_type_enum     NOT NULL DEFAULT 'buyer',
  priority            lead_priority_enum NOT NULL DEFAULT 'medium',

  -- Mülk kriterleri
  listing_id          UUID
                        REFERENCES listings(id) ON DELETE SET NULL,
  preferred_city      VARCHAR(100),
  preferred_district  VARCHAR(100),
  budget_min          NUMERIC(14,2),
  budget_max          NUMERIC(14,2),
  size_min_m2         INT,
  size_max_m2         INT,
  room_preference     VARCHAR(100),

  -- Takip
  last_contacted_at   TIMESTAMPTZ,
  next_follow_up_at   TIMESTAMPTZ,
  notes               TEXT,

  -- Sonuç
  deal_value_try      NUMERIC(14,2),
  lost_reason         VARCHAR(500),

  -- Uyumluluk
  kvkk_consent        BOOLEAN           NOT NULL DEFAULT FALSE,

  -- Soft delete
  deleted_at          TIMESTAMPTZ,

  created_at          TIMESTAMPTZ       NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ       NOT NULL DEFAULT NOW(),

  -- İş kuralı: budget_min <= budget_max
  CONSTRAINT leads_budget_order CHECK (
    budget_min IS NULL OR budget_max IS NULL OR budget_min <= budget_max
  ),
  -- İş kuralı: size_min <= size_max
  CONSTRAINT leads_size_order CHECK (
    size_min_m2 IS NULL OR size_max_m2 IS NULL OR size_min_m2 <= size_max_m2
  )
);

-- ─── Lead aktiviteleri ────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS lead_activities (
  id                    UUID            DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id               UUID            NOT NULL
                          REFERENCES leads(id) ON DELETE CASCADE,
  performed_by_user_id  UUID
                          REFERENCES users(id) ON DELETE SET NULL,
  type                  activity_type_enum NOT NULL,
  body                  TEXT,
  meta                  JSONB,
  created_at            TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- ─── İndeksler ───────────────────────────────────────────────────────────────

-- Acenta bazlı hızlı sorgular
CREATE INDEX IF NOT EXISTS leads_agency_idx
  ON leads(agency_id)
  WHERE deleted_at IS NULL;

-- Status + öncelik bazlı Kanban sorguları
CREATE INDEX IF NOT EXISTS leads_agency_status_priority_idx
  ON leads(agency_id, status, priority)
  WHERE deleted_at IS NULL;

-- Follow-up hatırlatma sorguları
CREATE INDEX IF NOT EXISTS leads_follow_up_idx
  ON leads(agency_id, next_follow_up_at)
  WHERE deleted_at IS NULL AND status NOT IN ('won','lost');

-- Danışman bazlı sorgular
CREATE INDEX IF NOT EXISTS leads_agent_idx
  ON leads(assigned_agent_id)
  WHERE deleted_at IS NULL;

-- Aktivite sorguları (lead başına)
CREATE INDEX IF NOT EXISTS lead_activities_lead_idx
  ON lead_activities(lead_id, created_at DESC);

-- Full-text search: isim + email + telefon
CREATE INDEX IF NOT EXISTS leads_fts_idx
  ON leads USING gin(
    to_tsvector('turkish',
      COALESCE(first_name,'') || ' ' ||
      COALESCE(last_name,'') || ' ' ||
      COALESCE(email,'') || ' ' ||
      COALESCE(phone,'')
    )
  )
  WHERE deleted_at IS NULL;

-- ─── updated_at trigger ───────────────────────────────────────────────────────

DROP TRIGGER IF EXISTS leads_updated_at ON leads;
CREATE TRIGGER leads_updated_at
  BEFORE UPDATE ON leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ─── Kısayol view: Bugünkü takipler ──────────────────────────────────────────

CREATE OR REPLACE VIEW crm_today_followups AS
SELECT
  l.id,
  l.agency_id,
  l.first_name,
  l.last_name,
  l.phone,
  l.email,
  l.status,
  l.priority,
  l.next_follow_up_at,
  l.preferred_city,
  l.preferred_district,
  u.full_name  AS assigned_agent_name,
  u.email      AS assigned_agent_email
FROM leads l
LEFT JOIN users u ON u.id = l.assigned_agent_id
WHERE l.deleted_at IS NULL
  AND l.next_follow_up_at::DATE <= CURRENT_DATE
  AND l.status NOT IN ('won','lost')
ORDER BY l.next_follow_up_at ASC;

COMMENT ON TABLE leads IS
  'M-01 CRM: Müşteri adayları (leads) — acenta bazlı Kanban pipeline';

COMMENT ON TABLE lead_activities IS
  'M-01 CRM: Lead aktivite geçmişi (arama, WhatsApp, gezme, not, AI aksiyon vb.)';

COMMENT ON VIEW crm_today_followups IS
  'M-01 CRM: Bugün ve öncesi vadesi geçmiş follow-up hatırlatmaları';


-- =============================================================================
-- M-04 — SCRIBE Agent: Üretilen İçerikler
-- =============================================================================

DO $$ BEGIN
  CREATE TYPE content_type_enum AS ENUM (
    'blog','social_pack','listing_desc','market_report','press_release'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS generated_contents (
  id                    UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id             UUID          REFERENCES agencies(id) ON DELETE SET NULL,
  requested_by_user_id  UUID          REFERENCES users(id) ON DELETE SET NULL,
  content_type          content_type_enum NOT NULL,
  topic                 VARCHAR(500)  NOT NULL,
  listing_id            UUID          REFERENCES listings(id) ON DELETE SET NULL,
  raw_output            TEXT          NOT NULL,
  ai_model              VARCHAR(100)  NOT NULL,
  tokens_used           INT,
  published_at          TIMESTAMPTZ,
  created_at            TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS generated_contents_agency_idx
  ON generated_contents(agency_id, content_type, created_at DESC);

CREATE INDEX IF NOT EXISTS generated_contents_listing_idx
  ON generated_contents(listing_id)
  WHERE listing_id IS NOT NULL;

COMMENT ON TABLE generated_contents IS
  'M-04 SCRIBE Agent: AI tarafından üretilen tüm içerikler (blog, sosyal, rapor vb.)';

