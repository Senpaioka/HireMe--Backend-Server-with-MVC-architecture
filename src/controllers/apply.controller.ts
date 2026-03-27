import { Request, Response } from "express";
import { Types } from "mongoose";
import { CreateApplicationData } from "../types/apply.types";
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

        // prevent applying to own job
        // if (jobData.postedBy === user._id.toString()) {
        //     return res.status(400).json({
        //         success: false,
        //         message: 'You cannot apply to your own job'
        //     });
        // }

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



// export controller functions
export const ApplyController = {
    applyToJob,
}



