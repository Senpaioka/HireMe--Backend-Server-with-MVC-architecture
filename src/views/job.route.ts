import express from 'express';
import { jobController } from '../controllers/job.controller';
import { auth } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';

const router = express.Router();

// Create a new job listing (employer only)
router.post('/create', auth, authorize('employer'), jobController.createJob);

// Get all job listings (public)
router.get('/feeds', jobController.getJobs);

// Get a single job listing by ID (private)
router.get('/:id', auth, jobController.getSingleJob);

// Get all job listings posted by a specific employer (employer only)
router.get('/employer/listings', auth, authorize('employer'), jobController.getJobsByEmployer);

// update a job listing (employer only)
router.patch('/update/:id', auth, authorize('employer'), jobController.updateJob);

// delete a job listing (employer and admin only)
router.delete('/delete/:id', auth, authorize('employer', 'admin'), jobController.deleteJob);

export const jobRoutes = router;