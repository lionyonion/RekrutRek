const supabase = require('../config/supabase')
const path     = require('path')

/**
 * Upload buffer ke Supabase Storage
 * @param {string} bucket  - nama bucket ('cvs' atau 'avatars')
 * @param {Buffer} buffer  - isi file
 * @param {string} originalName - nama file asli (untuk ekstensi)
 * @param {string} mimetype
 * @returns {string} public URL file
 */
async function uploadToStorage(bucket, buffer, originalName, mimetype) {
  const ext      = path.extname(originalName) || ''
  const filename = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}${ext}`

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filename, buffer, { contentType: mimetype, upsert: false })

  if (error) throw new Error(`Supabase Storage error: ${error.message}`)

  const { data } = supabase.storage.from(bucket).getPublicUrl(filename)
  return data.publicUrl
}

module.exports = uploadToStorage
