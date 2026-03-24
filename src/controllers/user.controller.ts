import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config/env";
import { User } from "../models/user.model";


// User Registration Controller
const register = async (req: Request, res: Response) => {
    try {
        const { username, email, password } = req.body;

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


// User Login Controller
const login = async (req: Request, res: Response) => {
    
    try {
        const {email, password} = req.body;

        // check if user exists
        const user = await User.findOne({email}).select('+password'); // include password field

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // compare provided password with hashed password in database
        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        // generate JWT token
        const token = jwt.sign(
            {
                userId: user._id,
                email: user.email,
                role: user.role,
            },
            config.jwt_secret,
            { 
                expiresIn: config.jwt_expires_in ?? '1h',
            }
        );

        // convert to object and remove password field before sending response
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: userResponse,
            token,
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error instanceof Error ? error.message : error,
        });
    }
}



// user logout controller
const logout = async (req: Request, res: Response) => {

    try {
        const token = req.headers.authorization?.split(' ')[1]; // assuming token is sent in Authorization

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "Token is required for logout",
            });
        }

        res.status(200).json({
            success: true,
            message: "User logged out successfully",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error",
            error: error instanceof Error ? error.message : error,
        });
    }
}








export const userController = {
    register,
    login,
    logout
}