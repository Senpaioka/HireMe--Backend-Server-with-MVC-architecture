import express from 'express';
import { chatController } from '../controllers/chat.controller';
import { auth } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/chat', auth, chatController.chat);

export const chatRoutes = router;