import express from 'express';
import { ApplyController } from '../controllers/apply.controller';
import { auth } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';

const router = express.Router();

// Apply for a job (employee only)
router.post('/submitted', auth, authorize('employee'), ApplyController.applyToJob);

export const applyRoutes = router;