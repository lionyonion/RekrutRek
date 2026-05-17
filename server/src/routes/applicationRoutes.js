const router = require('express').Router()
const {
  apply, getMyApplications, getApplicantsByJob, updateStatus
} = require('../controllers/applicationController')
const { authMiddleware, requireRole } = require('../middleware/auth')

router.post('/',
  authMiddleware,
  requireRole('jobseeker'),
  apply
)
router.get('/my',
  authMiddleware,
  requireRole('jobseeker'),
  getMyApplications
)
router.get('/job/:id',
  authMiddleware,
  requireRole('umkm', 'corporate'),
  getApplicantsByJob
)
router.put('/:id/status',
  authMiddleware,
  requireRole('umkm', 'corporate'),
  updateStatus
)

module.exports = router
