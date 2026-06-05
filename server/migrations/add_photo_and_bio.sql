-- Jalankan SQL ini di Supabase SQL Editor jika kolom belum ada

-- Kolom photo_url untuk semua tipe user
ALTER TABLE jobseeker_profiles  ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE umkm_profiles       ADD COLUMN IF NOT EXISTS photo_url TEXT;
ALTER TABLE corporate_profiles  ADD COLUMN IF NOT EXISTS photo_url TEXT;

-- Kolom bio untuk jobseeker
ALTER TABLE jobseeker_profiles  ADD COLUMN IF NOT EXISTS bio TEXT;

-- Kolom lokasi (latitude/longitude) — biasanya sudah ada, tapi pastikan
ALTER TABLE jobseeker_profiles  ADD COLUMN IF NOT EXISTS latitude  DOUBLE PRECISION;
ALTER TABLE jobseeker_profiles  ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;
ALTER TABLE umkm_profiles       ADD COLUMN IF NOT EXISTS latitude  DOUBLE PRECISION;
ALTER TABLE umkm_profiles       ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;
ALTER TABLE corporate_profiles  ADD COLUMN IF NOT EXISTS latitude  DOUBLE PRECISION;
ALTER TABLE corporate_profiles  ADD COLUMN IF NOT EXISTS longitude DOUBLE PRECISION;
