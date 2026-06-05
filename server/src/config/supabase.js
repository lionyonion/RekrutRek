const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

// Gunakan service role key agar bisa upload ke Storage tanpa terkena RLS
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_KEY
)

module.exports = supabase
