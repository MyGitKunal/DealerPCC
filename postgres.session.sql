-- =========================================
-- MASTER TABLES (used by all services)
-- =========================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE dealers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dealer_code TEXT UNIQUE NOT NULL,
  dealer_name TEXT NOT NULL,
  city TEXT,
  region TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dealer_id UUID REFERENCES dealers(id),
  name TEXT,
  username TEXT UNIQUE NOT NULL,
  official_email TEXT,
  role TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =========================================
-- API REGISTRATION
-- =========================================

CREATE TABLE api_registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dealer_id UUID REFERENCES dealers(id),
  application_name TEXT NOT NULL,
  client_id TEXT UNIQUE NOT NULL,
  status TEXT,
  registered_at TIMESTAMP DEFAULT NOW()
);

-- =========================================
-- DASHBOARD SUPPORT
-- =========================================

CREATE TABLE dashboard_metrics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  metric_key TEXT,
  metric_value NUMERIC,
  source_service TEXT,
  dealer_id UUID REFERENCES dealers(id),
  calculated_at TIMESTAMP DEFAULT NOW()
);

-- =========================================
-- DEALER PCC
-- =========================================

CREATE TABLE dealer_pcc (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dealer_id UUID REFERENCES dealers(id),
  submitted_by UUID REFERENCES users(id),
  application_number TEXT UNIQUE,
  application_date DATE,
  criteria_data JSONB,
  dealer_status TEXT,
  review_status TEXT,
  status TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE dealer_pcc_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  pcc_id UUID NOT NULL REFERENCES dealer_pcc(id) ON DELETE CASCADE,
  author_user_id UUID REFERENCES users(id),
  author_side TEXT NOT NULL,
  author_role TEXT,
  comment TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =========================================
-- EVENTS (MT Meet, TAS, Workshops)
-- =========================================

CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_type TEXT,
  title TEXT,
  event_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- =========================================
-- MT MEET FEEDBACK
-- =========================================

CREATE TABLE mt_meet_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id),
  dealer_id UUID REFERENCES dealers(id),
  feedback JSONB,
  submitted_at TIMESTAMP DEFAULT NOW()
);

-- =========================================
-- WORKSHOP SURVEY
-- =========================================

CREATE TABLE workshop_survey (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dealer_id UUID REFERENCES dealers(id),
  responses JSONB,
  submitted_at TIMESTAMP DEFAULT NOW()
);

-- =========================================
-- WARRANTY SURVEY
-- =========================================

CREATE TABLE warranty_survey (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dealer_id UUID REFERENCES dealers(id),
  responses JSONB,
  submitted_at TIMESTAMP DEFAULT NOW()
);

-- =========================================
-- TECHNICAL AWARENESS SESSION (TAS) SURVEY
-- =========================================

CREATE TABLE tas_survey (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id),
  dealer_id UUID REFERENCES dealers(id),
  responses JSONB,
  submitted_at TIMESTAMP DEFAULT NOW()
);

-- =========================================
-- TECHNICAL SUPPORT FEEDBACK
-- =========================================

CREATE TABLE technical_support_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dealer_id UUID REFERENCES dealers(id),
  ticket_reference TEXT,
  rating INT,
  comments TEXT,
  submitted_at TIMESTAMP DEFAULT NOW()
);

-- =========================================
-- DEALER ACCESS REQUESTS
-- =========================================

CREATE TABLE dealer_access_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dealer_id UUID REFERENCES dealers(id),
  requested_by TEXT,
  access_type TEXT,
  status TEXT,
  requested_at TIMESTAMP DEFAULT NOW(),
  approved_at TIMESTAMP
);

-- =========================================
-- INDEXES FOR PERFORMANCE / DASHBOARDS
-- =========================================

CREATE INDEX idx_users_dealer_id ON users(dealer_id);
CREATE INDEX idx_api_reg_dealer ON api_registrations(dealer_id);
CREATE INDEX idx_pcc_dealer_date ON dealer_pcc(dealer_id, application_date);
CREATE INDEX idx_ts_feedback_dealer ON technical_support_feedback(dealer_id);
CREATE INDEX idx_access_status ON dealer_access_requests(status);
SELECT * FROM users;

select *from dealer_pcc;