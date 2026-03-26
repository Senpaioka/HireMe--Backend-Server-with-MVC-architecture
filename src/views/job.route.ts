import express from 'express';
import { jobController } from '../controllers/job.controller';
import { auth } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';

const router = express.Router();

// Create a new job listing (employer only)
router.post('/create', auth, authorize('employer'), jobController.createJob);

export const jobRoutes = router;