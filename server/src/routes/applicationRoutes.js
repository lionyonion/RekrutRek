const router = require('express').Router()
const {
  apply, getMyApplications, getApplicantsForMyJobs, getApplicantsByJob, updateStatus
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
router.get('/my-jobs',
  authMiddleware,
  requireRole('umkm', 'corporate'),
  getApplicantsForMyJobs
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
