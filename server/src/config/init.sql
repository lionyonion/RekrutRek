-- ============================================================
-- REKRUTREK — Database Initialization Script
-- Jalankan: psql $DATABASE_URL -f src/config/init.sql
-- Atau via: npm run db:init
-- ============================================================

-- Aktifkan ekstensi UUID
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ============================================================
-- TABLE: users  (satu tabel untuk semua tipe user)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email       VARCHAR(255) NOT NULL,
  password    VARCHAR(255) NOT NULL,
  user_type   VARCHAR(20)  NOT NULL
                CONSTRAINT users_type_check
                CHECK (user_type IN ('jobseeker', 'umkm', 'corporate')),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT users_email_unique UNIQUE (email)
);


-- ============================================================
-- TABLE: jobseeker_profiles
-- ============================================================
CREATE TABLE IF NOT EXISTS jobseeker_profiles (
  id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID         NOT NULL,
  full_name       VARCHAR(100),
  phone           VARCHAR(20),
  latitude        DECIMAL(9,6),          -- koordinat tempat tinggal
  longitude       DECIMAL(9,6),
  salary_expect   INTEGER                -- ekspektasi gaji (Rp)
                    CONSTRAINT salary_positive CHECK (salary_expect >= 0),
  availability    VARCHAR(20)
                    CONSTRAINT avail_check
                    CHECK (availability IN ('full_time','part_time','freelance','internship')),
  cv_url          TEXT,                  -- path/URL file PDF
  cv_extracted    JSONB,                 -- {name, skills[], education[], experience[]}
  bio             TEXT,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT fk_js_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT jobseeker_profiles_user_unique UNIQUE (user_id)
);


-- ============================================================
-- TABLE: umkm_profiles
-- ============================================================
CREATE TABLE IF NOT EXISTS umkm_profiles (
  id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID         NOT NULL,
  business_name   VARCHAR(150),
  business_type   VARCHAR(100),          -- kuliner, retail, jasa, dll
  latitude        DECIMAL(9,6),
  longitude       DECIMAL(9,6),
  address         TEXT,
  phone           VARCHAR(20),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT fk_umkm_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT umkm_profiles_user_unique UNIQUE (user_id)
);


-- ============================================================
-- TABLE: corporate_profiles
-- ============================================================
CREATE TABLE IF NOT EXISTS corporate_profiles (
  id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID         NOT NULL,
  company_name    VARCHAR(150),
  industry        VARCHAR(100),
  address         TEXT,
  hrd_name        VARCHAR(100),
  company_size    VARCHAR(20)
                    CONSTRAINT size_check
                    CHECK (company_size IN ('1-50','51-200','201-500','500+')),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  CONSTRAINT fk_corp_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT corporate_profiles_user_unique UNIQUE (user_id)
);


-- ============================================================
-- TABLE: jobs  (lowongan — diposting UMKM atau Korporat)
-- ============================================================
CREATE TABLE IF NOT EXISTS jobs (
  id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  poster_id       UUID         NOT NULL,
  title           VARCHAR(200) NOT NULL
                    CONSTRAINT title_not_empty CHECK (char_length(title) > 0),
  description     TEXT,
  requirements    TEXT,
  job_type        VARCHAR(20)  NOT NULL
                    CONSTRAINT job_type_check
                    CHECK (job_type IN ('umkm','corporate')),

  -- Kompensasi
  salary_min      INTEGER      CONSTRAINT sal_min_pos CHECK (salary_min >= 0),
  salary_max      INTEGER      CONSTRAINT sal_max_pos CHECK (salary_max >= 0),
  CONSTRAINT salary_range_valid CHECK (
    salary_max IS NULL OR salary_min IS NULL OR salary_max >= salary_min
  ),

  -- Lokasi
  latitude        DECIMAL(9,6),
  longitude       DECIMAL(9,6),
  address         TEXT,
  max_distance_km INTEGER      DEFAULT 20
                    CONSTRAINT dist_positive CHECK (max_distance_km > 0),

  is_open         BOOLEAN      NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),

  CONSTRAINT fk_job_poster FOREIGN KEY (poster_id)
    REFERENCES users(id) ON DELETE CASCADE
);


-- ============================================================
-- TABLE: applications  (lamaran + skor AI)
-- ============================================================
CREATE TABLE IF NOT EXISTS applications (
  id              UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id          UUID         NOT NULL,
  applicant_id    UUID         NOT NULL,

  -- Status proses rekrutmen
  status          VARCHAR(20)  NOT NULL DEFAULT 'pending'
                    CONSTRAINT status_check
                    CHECK (status IN ('pending','reviewed','accepted','rejected')),

  -- Skor kecocokan dari Dual-Input Deep Learning model
  match_score     DECIMAL(5,2)           -- 0.00 – 100.00
                    CONSTRAINT score_range
                    CHECK (match_score IS NULL OR (match_score >= 0 AND match_score <= 100)),

  -- Detail skor per dimensi (fleksibel untuk berbagai model AI)
  -- Contoh isi: {"salary": 90.5, "distance": 78.2, "skills": 85.0, "availability": 92.0}
  score_detail    JSONB,

  -- Jarak hasil haversine (km) — dihitung di Express sebelum masuk DB
  distance_km     DECIMAL(6,2)
                    CONSTRAINT dist_km_pos CHECK (distance_km IS NULL OR distance_km >= 0),

  applied_at      TIMESTAMPTZ  NOT NULL DEFAULT now(),

  CONSTRAINT fk_app_job FOREIGN KEY (job_id)
    REFERENCES jobs(id) ON DELETE CASCADE,
  CONSTRAINT fk_app_applicant FOREIGN KEY (applicant_id)
    REFERENCES users(id) ON DELETE CASCADE,

  -- Satu pelamar hanya bisa melamar satu lowongan satu kali
  CONSTRAINT applications_unique UNIQUE (job_id, applicant_id)
);


-- ============================================================
-- INDEXES — performa query umum
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_users_email       ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_type        ON users(user_type);
CREATE INDEX IF NOT EXISTS idx_jobs_poster       ON jobs(poster_id);
CREATE INDEX IF NOT EXISTS idx_jobs_type_open    ON jobs(job_type, is_open);
CREATE INDEX IF NOT EXISTS idx_jobs_created      ON jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_apps_job          ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_apps_applicant    ON applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_apps_score        ON applications(match_score DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_apps_status       ON applications(status);

-- GIN index untuk query JSONB (pencarian dalam cv_extracted & score_detail)
CREATE INDEX IF NOT EXISTS idx_cv_extracted      ON jobseeker_profiles USING GIN (cv_extracted);
CREATE INDEX IF NOT EXISTS idx_score_detail      ON applications USING GIN (score_detail);


-- ============================================================
-- TRIGGER — auto-update kolom updated_at
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_users_updated') THEN
    CREATE TRIGGER trg_users_updated
      BEFORE UPDATE ON users
      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'trg_jobs_updated') THEN
    CREATE TRIGGER trg_jobs_updated
      BEFORE UPDATE ON jobs
      FOR EACH ROW EXECUTE FUNCTION update_updated_at();
  END IF;
END $$;

