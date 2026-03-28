import { Request, Response } from "express";
import { Types } from "mongoose";
import { CreateApplicationData, UpdateApplicationData } from "../types/apply.types";
import Application from "../models/apply.model";
import { Job } from "../models/job.model";


// Apply for a job (employee only)
const applyToJob = async (
    req: Request<{}, {}, CreateApplicationData>,
    res: Response
) => {

    try {
        const user = req.user; // user is added to req by auth middleware

        if (!user || user.role !== 'employee') {
            return res.status(403).json({
                success: false,
                message: 'Only employees can apply for jobs'
            });
        }

        const { job } = req.body;
        
        // check if jobId is valid
        if (!Types.ObjectId.isValid(job)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid job ID'
            });
        }

        // check if job exists
        const jobData = await Job.findById(job);

        if (!jobData) {
            return res.status(404).json({
                success: false,
                message: 'Job not found'
            });
        }

        // prevent duplicate applications
        const alreadyApplied = await Application.findOne({
            applicant: user.userId,
            job: job
        });
        
        if (alreadyApplied) {
            return res.status(400).json({
                success: false,
                message: 'You have already applied to this job'
            });
        };

        // create application
        const application = await Application.create({
            applicant: new Types.ObjectId(user.userId),
            job: new Types.ObjectId(job),
            coverLetter: req.body.coverLetter as string,
            resumeUrl: req.body.resumeUrl as string,
            status: 'pending'
        });

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            data: application
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error instanceof Error ? error.message : 'Failed to apply for job'
        });
    }
}


// see all the applications for a job (owner only)
const getMyApplications = async (req: Request, res: Response) => {

    try {
        const user = req.user;

        if (!user || user.role !== 'employee') {
            return res.status(403).json({
                success: false,
                message: 'Only employees can view their applications'
            });
        }

        const applications = await Application.find({ applicant: user.userId }).populate('job');

        res.status(200).json({
            success: true,
            message: 'Applications retrieved successfully',
            data: applications
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error instanceof Error ? error.message : 'Failed to retrieve applications'
        });
    }
}


// update application status (owner only)
const updateApplicationStatus = async (
    req: Request<{ id: string }, {}, UpdateApplicationData>,
    res: Response
) => {

    try {
        const user = req.user;
        const {id} = req.params;

        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid application ID'
            });
        }

        const application = await Application.findById(id).populate('job');

        if (!application) {
            return res.status(404).json({
                success: false,
                message: 'Application not found'
            });
        }

        const job = application.job as any; // populated job

        const isOwner = job.employer === user?.userId;
        const isAdmin = user?.role === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Only the job owner or admin can update application status'
            });
        }

        const updatedApplication = await Application.findByIdAndUpdate(
            id,
            { status: req.body.status },
            {
                returnDocument: 'after',
                runValidators: true
            }
        );

        res.status(200).json({
            success: true,
            message: 'Application status updated successfully',
            data: updatedApplication
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error instanceof Error ? error.message : 'Failed to update application status'
        });
    }
}


// export controller functions
export const ApplyController = {
    applyToJob,
    getMyApplications,
    updateApplicationStatus
}



