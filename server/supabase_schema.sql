-- ==============================================================================
-- CHUOICUNGUNG.COM (CCU) - SUPABASE POSTGRESQL SCHEMA
-- Hướng dẫn: Copy toàn bộ nội dung file này và Paste vào mục "SQL Editor"
-- trên Supabase Dashboard (https://app.supabase.com) rồi nhấn nút "RUN".
-- ==============================================================================

-- 1. Bảng Nhà Cung Ứng / Doanh Nghiệp (Enterprises)
CREATE TABLE IF NOT EXISTS enterprises (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  normalized_name TEXT,
  category TEXT,
  province TEXT,
  stage TEXT,
  phase TEXT,
  verification_status TEXT DEFAULT 'UNVERIFIED',
  data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_enterprises_name ON enterprises(name);
CREATE INDEX IF NOT EXISTS idx_enterprises_category ON enterprises(category);
CREATE INDEX IF NOT EXISTS idx_enterprises_province ON enterprises(province);
CREATE INDEX IF NOT EXISTS idx_enterprises_data_gin ON enterprises USING gin (data);

-- 2. Bảng Nhà Máy Sản Xuất (Factories)
CREATE TABLE IF NOT EXISTS factories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  province TEXT,
  industrial_park TEXT,
  category TEXT,
  data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_factories_name ON factories(name);
CREATE INDEX IF NOT EXISTS idx_factories_province ON factories(province);
CREATE INDEX IF NOT EXISTS idx_factories_industrial_park ON factories(industrial_park);
CREATE INDEX IF NOT EXISTS idx_factories_data_gin ON factories USING gin (data);

-- 3. Bảng Khu Công Nghiệp (Industrial Parks)
CREATE TABLE IF NOT EXISTS industrial_parks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  province TEXT,
  data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_industrial_parks_name ON industrial_parks(name);
CREATE INDEX IF NOT EXISTS idx_industrial_parks_province ON industrial_parks(province);
CREATE INDEX IF NOT EXISTS idx_industrial_parks_data_gin ON industrial_parks USING gin (data);

-- 4. Bảng Tổ Chức / Hiệp Hội (Organizations)
CREATE TABLE IF NOT EXISTS organizations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  normalized_name TEXT,
  tax_code TEXT,
  roles TEXT[] DEFAULT '{}',
  canonical_slug TEXT UNIQUE,
  status TEXT DEFAULT 'PUBLISHED',
  verification_status TEXT DEFAULT 'UNVERIFIED',
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_organizations_roles ON organizations USING gin(roles);
CREATE INDEX IF NOT EXISTS idx_organizations_slug ON organizations(canonical_slug);

-- 5. Bảng Nhu Cầu Tìm Nguồn / RFQ (Demands)
CREATE TABLE IF NOT EXISTS demands (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  stage_id INT,
  phase_id TEXT,
  category TEXT,
  author_name TEXT,
  author_company TEXT,
  author_email TEXT,
  author_phone TEXT,
  location TEXT,
  budget TEXT,
  deadline TEXT,
  requirements TEXT,
  status TEXT DEFAULT 'pending',
  responses_count INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_demands_status_cat ON demands(status, category);

-- 6. Bảng Bản Nháp Nhu Cầu từ SUPPI AI (Requirement Drafts)
CREATE TABLE IF NOT EXISTS requirement_drafts (
  id TEXT PRIMARY KEY,
  conversation_id TEXT NOT NULL,
  owner_id TEXT,
  idempotency_key TEXT,
  category TEXT NOT NULL,
  product_service TEXT NOT NULL,
  quantity NUMERIC,
  unit TEXT,
  delivery_location JSONB,
  deadline TEXT,
  specifications JSONB DEFAULT '[]'::jsonb,
  certifications JSONB DEFAULT '[]'::jsonb,
  sample_required BOOLEAN,
  notes TEXT,
  status TEXT DEFAULT 'DRAFT',
  submitted_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_drafts_conv ON requirement_drafts(conversation_id);
CREATE INDEX IF NOT EXISTS idx_drafts_owner ON requirement_drafts(owner_id, conversation_id);

-- 7. Bảng Lịch Sử Hội Thoại Trợ Lý AI SUPPI & CHAINY (Suppi Conversations)
CREATE TABLE IF NOT EXISTS suppi_conversations (
  id TEXT PRIMARY KEY,
  previous_response_id TEXT,
  owner_id TEXT,
  assistant_mode TEXT DEFAULT 'SUPPI',
  dify_conversation_id TEXT,
  latest_results JSONB DEFAULT '[]'::jsonb,
  slots JSONB DEFAULT '{}'::jsonb,
  messages JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'ACTIVE',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_conv_owner ON suppi_conversations(owner_id);

-- 8. Public content is projected by the server; browsers never get service keys.
CREATE TABLE IF NOT EXISTS public.ccu_documents (
  id TEXT NOT NULL,
  collection TEXT NOT NULL,
  visibility TEXT NOT NULL DEFAULT 'PUBLIC' CHECK (visibility IN ('PUBLIC','PRIVATE')),
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (collection, id)
);
CREATE INDEX IF NOT EXISTS idx_ccu_documents_visibility ON public.ccu_documents(collection, visibility);

-- Private submissions are never part of a public list or assistant search.
CREATE TABLE IF NOT EXISTS public.ccu_submissions (
  id TEXT PRIMARY KEY,
  kind TEXT NOT NULL,
  owner_id TEXT NOT NULL,
  idempotency_key TEXT,
  status TEXT NOT NULL DEFAULT 'PENDING',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_ccu_submissions_owner ON public.ccu_submissions(owner_id, kind);

-- No anonymous/authenticated direct table access. Backend service_role only.
-- Additive security migration: preserves all existing records and policies.
DO $$
DECLARE relation TEXT;
BEGIN
  FOREACH relation IN ARRAY ARRAY['enterprises','factories','industrial_parks',
    'organizations','demands','requirement_drafts','suppi_conversations',
    'ccu_documents','ccu_submissions']
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', relation);
    EXECUTE format('REVOKE ALL ON TABLE public.%I FROM anon, authenticated', relation);
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.%I TO service_role', relation);
  END LOOP;
END $$;
REVOKE ALL ON SEQUENCE public.demands_id_seq FROM anon, authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.demands_id_seq TO service_role;
NOTIFY pgrst, 'reload schema';
