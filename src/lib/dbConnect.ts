import { Request, Response, NextFunction } from 'express';
import { connectDB } from './db';

export const dbConnect = async (
  _req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
};