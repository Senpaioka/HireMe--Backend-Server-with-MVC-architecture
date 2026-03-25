import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import config from "../config/env";

type JwtPayloadType = {
  userId: string;
  role: string;
};

// Authentication middleware to verify JWT token
export const auth = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    
    try {

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: "Authorization header missing or malformed",
            });
        }        


        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token as string, config.jwt_secret);

        if (
        typeof decoded === 'string' ||
        !('userId' in decoded) ||
        !('role' in decoded)
        ) {
        return res.status(401).json({
            success: false,
            message: 'Invalid token',
        });
        }

        req.user = decoded as JwtPayloadType;

        next(); 

    }catch (error) {
        res.status(401).json({
            success: false,
            message: "Unauthorized",
            error: error instanceof Error ? error.message : error,
        });
    }

}

