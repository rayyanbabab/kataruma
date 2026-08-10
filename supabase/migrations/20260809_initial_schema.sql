-- =============================================================
-- MIGRASI DATABASE: Kataruma RW 10
-- Supabase Project: xovsyivddnxwwztcvsxb
-- =============================================================

-- 1. KV STORE (dipakai Edge Function Hono backend)
CREATE TABLE IF NOT EXISTS kv_store_35d97b10 (
  key   TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_kv_store_key_prefix ON kv_store_35d97b10 (key text_pattern_ops);
ALTER TABLE kv_store_35d97b10 ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "service_role_all" ON kv_store_35d97b10;
CREATE POLICY "service_role_all" ON kv_store_35d97b10
  FOR ALL USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- 2. ALBUMS
CREATE TABLE IF NOT EXISTS albums (
  id          TEXT        NOT NULL PRIMARY KEY,
  name        TEXT        NOT NULL,
  description TEXT        NOT NULL DEFAULT '',
  date        DATE        NOT NULL,
  cover       TEXT        NOT NULL DEFAULT '',
  status      TEXT        NOT NULL DEFAULT 'publish' CHECK (status IN ('publish','draft')),
  drive_link  TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE albums ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "albums_public_read" ON albums;
CREATE POLICY "albums_public_read" ON albums FOR SELECT USING (true);
DROP POLICY IF EXISTS "albums_service_write" ON albums;
CREATE POLICY "albums_service_write" ON albums FOR ALL
  USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- 3. PHOTOS
CREATE TABLE IF NOT EXISTS photos (
  id          TEXT        NOT NULL PRIMARY KEY,
  album_id    TEXT        NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
  url         TEXT        NOT NULL,
  title       TEXT        NOT NULL DEFAULT '',
  caption     TEXT        NOT NULL DEFAULT '',
  tags        TEXT[]      NOT NULL DEFAULT '{}',
  date        DATE        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_photos_album_id ON photos (album_id);
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "photos_public_read" ON photos;
CREATE POLICY "photos_public_read" ON photos FOR SELECT USING (true);
DROP POLICY IF EXISTS "photos_service_write" ON photos;
CREATE POLICY "photos_service_write" ON photos FOR ALL
  USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- 4. VIDEOS
CREATE TABLE IF NOT EXISTS videos (
  id          TEXT        NOT NULL PRIMARY KEY,
  album_id    TEXT        NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
  title       TEXT        NOT NULL,
  description TEXT        NOT NULL DEFAULT '',
  thumbnail   TEXT        NOT NULL DEFAULT '',
  duration    TEXT        NOT NULL DEFAULT '',
  source      TEXT        NOT NULL DEFAULT 'link' CHECK (source IN ('youtube','instagram','tiktok','drive','mp4','link')),
  url         TEXT        NOT NULL,
  tags        TEXT[]      NOT NULL DEFAULT '{}',
  date        DATE        NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_videos_album_id ON videos (album_id);
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "videos_public_read" ON videos;
CREATE POLICY "videos_public_read" ON videos FOR SELECT USING (true);
DROP POLICY IF EXISTS "videos_service_write" ON videos;
CREATE POLICY "videos_service_write" ON videos FOR ALL
  USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- 5. EVENTS
CREATE TABLE IF NOT EXISTS events (
  id             TEXT        NOT NULL PRIMARY KEY,
  title          TEXT        NOT NULL,
  date           DATE        NOT NULL,
  description    TEXT        NOT NULL DEFAULT '',
  type           TEXT        NOT NULL DEFAULT 'custom' CHECK (type IN ('national','islamic','custom')),
  show_countdown BOOLEAN     NOT NULL DEFAULT TRUE,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "events_public_read" ON events;
CREATE POLICY "events_public_read" ON events FOR SELECT USING (true);
DROP POLICY IF EXISTS "events_service_write" ON events;
CREATE POLICY "events_service_write" ON events FOR ALL
  USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- 6. COMMENTS
CREATE TABLE IF NOT EXISTS comments (
  id         TEXT        NOT NULL PRIMARY KEY,
  name       TEXT        NOT NULL,
  message    TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "comments_public_read" ON comments;
CREATE POLICY "comments_public_read" ON comments FOR SELECT USING (true);
DROP POLICY IF EXISTS "comments_public_insert" ON comments;
CREATE POLICY "comments_public_insert" ON comments FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "comments_service_delete" ON comments;
CREATE POLICY "comments_service_delete" ON comments FOR DELETE USING (auth.role() = 'service_role');

-- 7. REPORTS
CREATE TABLE IF NOT EXISTS reports (
  id           TEXT        NOT NULL PRIMARY KEY,
  title        TEXT        NOT NULL,
  year         INTEGER     NOT NULL,
  file_type    TEXT        NOT NULL DEFAULT 'pdf' CHECK (file_type IN ('pdf','xlsx','docx','other')),
  file_name    TEXT        NOT NULL DEFAULT '',
  file_url     TEXT        NOT NULL DEFAULT '',
  storage_path TEXT,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "reports_public_read" ON reports;
CREATE POLICY "reports_public_read" ON reports FOR SELECT USING (true);
DROP POLICY IF EXISTS "reports_service_write" ON reports;
CREATE POLICY "reports_service_write" ON reports FOR ALL
  USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- 8. POSTERS
CREATE TABLE IF NOT EXISTS posters (
  id            TEXT        NOT NULL PRIMARY KEY,
  title         TEXT        NOT NULL,
  image_url     TEXT        NOT NULL,
  link          TEXT,
  active        BOOLEAN     NOT NULL DEFAULT TRUE,
  show_as_popup BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE posters ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "posters_public_read" ON posters;
CREATE POLICY "posters_public_read" ON posters FOR SELECT USING (true);
DROP POLICY IF EXISTS "posters_service_write" ON posters;
CREATE POLICY "posters_service_write" ON posters FOR ALL
  USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

-- 9. SITE_CONFIG
CREATE TABLE IF NOT EXISTS site_config (
  key        TEXT        NOT NULL PRIMARY KEY,
  value      JSONB       NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE site_config ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "site_config_public_read" ON site_config;
CREATE POLICY "site_config_public_read" ON site_config FOR SELECT USING (true);
DROP POLICY IF EXISTS "site_config_service_write" ON site_config;
CREATE POLICY "site_config_service_write" ON site_config FOR ALL
  USING (auth.role() = 'service_role') WITH CHECK (auth.role() = 'service_role');

INSERT INTO site_config (key, value) VALUES
  ('visitors', '0'),
  ('admin_secret', '"201204"'),
  ('autoprefs', '{}'),
  ('site_info', '{"name":"Kataruma RW 10","tagline":"Bersama Berkarya, Bersatu Membangun Lingkungan","email":"kataruma.rw10@gmail.com","whatsapp":"+62 812-3456-7890","instagram":"@kataruma.rw10","address":"Jl. Kalibata Tengah XVI, RW.10, Kelurahan Kalibata, Kecamatan Pancoran, Jakarta Selatan, DKI Jakarta 12740"}')
ON CONFLICT (key) DO NOTHING;
