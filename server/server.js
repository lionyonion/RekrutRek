require('dotenv').config()
const app = require('./src/app')
const fs  = require('fs')
const path = require('path')

const PORT = process.env.PORT || 5000

// Pastikan folder uploads tersedia
const uploadDir = path.join(__dirname, 'uploads')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

app.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════╗
  ║   🚀  Rekrutrek Server Running       ║
  ║   Port  : ${PORT}                       ║
  ║   Env   : ${(process.env.NODE_ENV || 'development').padEnd(12)}         ║
  ╚══════════════════════════════════════╝
  `)
})
