const multer = require('multer')

const memoryStorage = multer.memoryStorage()

const cvFilter = (_req, file, cb) => {
  if (file.mimetype === 'application/pdf') return cb(null, true)
  cb(new Error('Hanya file PDF yang diizinkan'), false)
}

const imageFilter = (_req, file, cb) => {
  if (['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) return cb(null, true)
  cb(new Error('Hanya file JPG/PNG/WEBP yang diizinkan'), false)
}

const maxSizeMB = parseInt(process.env.MAX_FILE_SIZE_MB || '5')

const upload = multer({
  storage: memoryStorage,
  fileFilter: cvFilter,
  limits: { fileSize: maxSizeMB * 1024 * 1024 },
})

const uploadImage = multer({
  storage: memoryStorage,
  fileFilter: imageFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
})

module.exports = { upload, uploadImage }
