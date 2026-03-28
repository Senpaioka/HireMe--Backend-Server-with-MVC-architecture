import express from 'express';
import { ApplyController } from '../controllers/apply.controller';
import { auth } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';

const router = express.Router();

// Apply for a job (employee only)
router.post('/submitted', auth, authorize('employee'), ApplyController.applyToJob);

// get my applications (employee only)
router.get('/my-applications', auth, authorize('employee'), ApplyController.getMyApplications);

// update application status (employer/admin only)
router.patch('/job-status-update/:id', auth, authorize('employer', 'admin'), ApplyController.updateApplicationStatus);

// export the router
export const applyRoutes = router;