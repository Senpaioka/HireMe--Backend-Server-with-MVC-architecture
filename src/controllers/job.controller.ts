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


// get all job listings
const getJobs = async (req: Request, res: Response) => {

    try {
        const jobs = await Job.find().populate('postedBy', 'username email'); // Populate the postedBy field with the employer's username and email

        res.status(200).json({
            success: true,
            message: 'Job listings retrieved successfully',
            data: jobs,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve job listings',
            error: error instanceof Error ? error.message : 'Failed to fetch job listings',
        });
    }

}


// get single job listing by ID
const getSingleJob = async (req: Request, res: Response) => {

    try {
        const { id } = req.params as { id: string };

        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid job ID',
            });
        }

        const job = await Job.findById(id).populate('postedBy', 'username email');

        if (!job) {
            return res.status(404).json({
                success: false,
                message: 'Job listing not found',
            });
        }

        res.status(200).json({
            success: true,
            message: 'Job listing retrieved successfully',
            data: job,
        });


    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve job listing',
            error: error instanceof Error ? error.message : 'Failed to fetch job listing',
        })
    }
}


// get all job listings posted by a specific employer
const getJobsByEmployer = async (req: Request, res: Response) => {

    try {
        const user = req.user;

        if (!user || user.role !== 'employer') {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized',
            });
        }

        const getPostedJobs = await Job.find({ postedBy: user.userId });

        res.status(200).json({
            success: true,
            message: 'Job listings retrieved successfully',
            data: getPostedJobs,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve job listings',
            error: error instanceof Error ? error.message : 'Failed to fetch job listings',
        });
    }
}


// update job (only owner)
const updateJob = async (req: Request, res: Response) => {

    try {
        const user = req.user;
        const {id} = req.params;

        const getJob = await Job.findById(id);

        if (!getJob) {
            return res.status(404).json({
                success: false,
                message: 'Job listing not found',
            });
        }

        if (getJob.postedBy.toString() !== user?.userId) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this job listing',
            });
        }

        const jobUpdated = await Job.findByIdAndUpdate(id, req.body, { returnDocument: 'after', runValidators: true });

        res.status(200).json({
            success: true,
            message: 'Job listing updated successfully',
            data: jobUpdated,
        });
    
    } catch(error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update job listing',
            error: error instanceof Error ? error.message : 'Failed to update job listing',
        });
    }

}


// Delete job (owner or admin)
const deleteJob = async (req: Request, res: Response) => {

    try {
        const user = req.user;
        const {id} = req.params;

        const findJob = await Job.findById(id);

        if (!findJob) {
            return res.status(404).json({
                success: false,
                message: 'Job listing not found',
            });
        }

        const isOwner = findJob.postedBy.toString() === user?.userId;
        const isAdmin = user?.role === 'admin';
        
        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this job listing',
            });
        }

        await Job.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Job listing deleted successfully',
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete job listing',
            error: error instanceof Error ? error.message : 'Failed to delete job listing',
        });
    }
}


export const jobController = {
    createJob,
    getJobs,
    getSingleJob,
    getJobsByEmployer,
    updateJob,
    deleteJob,
}