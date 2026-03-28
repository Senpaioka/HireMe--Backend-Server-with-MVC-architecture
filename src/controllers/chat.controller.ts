import { Request, Response } from 'express';
import { chatWithAssistant } from '../services/chat.service';

const chat = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required',
      });
    }

    const reply = await chatWithAssistant(message, req.user?.userId);

    res.status(200).json({
      success: true,
      reply,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Chat failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const chatController = { chat };