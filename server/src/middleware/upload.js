const multer = require('multer')
const path   = require('path')

const storage = multer.diskStorage({
  destination: (_req, _file, cb) =>
    cb(null, path.join(__dirname, '../../uploads')),
  filename: (_req, file, cb) => {
    const ext  = path.extname(file.originalname)
    const name = `cv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}${ext}`
    cb(null, name)
  },
})

const fileFilter = (_req, file, cb) => {
  if (file.mimetype === 'application/pdf')
    return cb(null, true)
  cb(new Error('Hanya file PDF yang diizinkan'), false)
}

const maxSizeMB = parseInt(process.env.MAX_FILE_SIZE_MB || '5')

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: maxSizeMB * 1024 * 1024 },
})

module.exports = upload
