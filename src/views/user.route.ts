import express from 'express';
import { userController } from '../controllers/user.controller';


const router = express.Router();

// User registration route
router.post('/register', userController.register);

// User login route
router.post('/login', userController.login);

// User logout route
router.post('/logout', userController.logout);


export const userRoutes = router;