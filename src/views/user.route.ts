import express from 'express';
import { userController } from '../controllers/user.controller';
import {auth} from '../middlewares/auth.middleware';
import {authorize} from '../middlewares/role.middleware';


const router = express.Router();

// User registration route
router.post('/register', userController.register);

// User login route
router.post('/login', userController.login);

// User logout route
router.post('/logout', userController.logout);

// Get all users route (admin only)
router.get('/all-users', auth, authorize('admin'), userController.getAllUsers);


export const userRoutes = router;