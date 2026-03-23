import express from 'express';
import { userController } from '../controllers/user.controller';


const router = express.Router();

// User registration route
router.post('/register', userController.register);



export const userRoutes = router;