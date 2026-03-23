import { Request, Response } from "express";
// import jwt, {Secret, SignOptions}  from "jsonwebtoken";
import jwt from "jsonwebtoken";
import config from "../config/env";
import { User } from "../models/user.model";


const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password, role } = req.body;

        // Check if user already exists
        const isUserExist = await User.exists({ email });

        if (isUserExist) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        // Create new user
        const newUser = new User({
            username,
            email,
            password,
            role: 'employee',
        });


        // save user to database
        await newUser.save(); // triggers pre-save hook to hash password

        // generate JWT token
        const token = jwt.sign(
            {
                userId: newUser._id,
                email: newUser.email,
                role: newUser.role,
            },
            config.jwt_secret,
            { 
                expiresIn: config.jwt_expires_in ?? '1h',
            }
        );

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: newUser,
            token,
        });


       
    } catch (error) {
        res.status(500).json({
        message: "Server error",
        error: error instanceof Error ? error.message : error,
    });
    }
}


export const userController = {
    register,
}