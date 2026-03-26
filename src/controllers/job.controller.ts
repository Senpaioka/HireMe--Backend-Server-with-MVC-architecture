import { Request, Response } from "express";
import { Types } from "mongoose";
import { Job } from "../models/job.model";

// create a new job listing
const createJob = async (req: Request, res: Response) => {

    try {
        const user = req.user; // req.user is populated by authentication middleware

        if (!user || user.role !== 'employer') {
            return res.status(403).json({
                success: false,
                message: 'Only employers can create job listings',
            });
        }

        const jobData = {
            ...req.body,
            postedBy: user.userId, // Set the postedBy field to the authenticated user's ID
        };

        const job = await Job.create(jobData);

        res.status(201).json({
            success: true,
            message: 'Job listing created successfully',
            data: job,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to create job listing',
            error: error instanceof Error ? error.message : 'Unknown error',
        });
    }

}

export const jobController = {
    createJob,
}