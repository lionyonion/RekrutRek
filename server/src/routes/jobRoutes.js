const router = require('express').Router()
const {
  getJobs, getJobById, getMyJobs, createJob, deleteJob
} = require('../controllers/jobController')
const { authMiddleware, requireRole } = require('../middleware/auth')

router.get('/', getJobs)
router.get('/my', authMiddleware, requireRole('umkm', 'corporate'), getMyJobs)
router.get('/:id', getJobById)
router.post('/',
  authMiddleware,
  requireRole('umkm', 'corporate'),
  createJob
)
router.delete('/:id',
  authMiddleware,
  requireRole('umkm', 'corporate'),
  deleteJob
)

module.exports = router
