import { Request, Response } from "express";
import { Types } from "mongoose";
import { Job } from "../models/job.model";
import { CreateJobData, JobFilters, UpdateJobData } from "../types/job.types";


// create a new job listing
// const createJob = async (req: Request, res: Response) => {

//     try {
//         const user = req.user; // req.user is populated by authentication middleware

//         if (!user || user.role !== 'employer') {
//             return res.status(403).json({
//                 success: false,
//                 message: 'Only employers can create job listings',
//             });
//         }

//         const jobData = {
//             ...req.body,
//             postedBy: user.userId, // Set the postedBy field to the authenticated user's ID
//         };

//         const job = await Job.create(jobData);

//         res.status(201).json({
//             success: true,
//             message: 'Job listing created successfully',
//             data: job,
//         });

//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Failed to create job listing',
//             error: error instanceof Error ? error.message : 'Unknown error',
//         });
//     }

// }

// more strongly typed version of createJob
const createJob = async (
  req: Request<{}, {}, CreateJobData>,
  res: Response
) => {
  try {
    const user = req.user;

    if (!user || user.role !== 'employer') {
      return res.status(403).json({
        success: false,
        message: 'Only employers can create job listings',
      });
    }

    // now req.body is strongly typed
    const jobData: CreateJobData & { postedBy: string } = {
        ...req.body,
        postedBy: user.userId,
    };

    const job = await Job.create(jobData as any); // Type assertion to bypass Mongoose's type issues

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
};








// get all job listings without filters
// const getJobs = async (req: Request, res: Response) => {

//     try {
//         const jobs = await Job.find().populate('postedBy', 'username email'); // Populate the postedBy field with the employer's username and email

//         res.status(200).json({
//             success: true,
//             message: 'Job listings retrieved successfully',
//             data: jobs,
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             message: 'Failed to retrieve job listings',
//             error: error instanceof Error ? error.message : 'Failed to fetch job listings',
//         });
//     }

// }


// get all job listings with optional filters
const getJobs = async (req: Request, res: Response) => {
  try {
    const {
      location,
      jobType,
      minSalary,
      maxSalary,
      status,
    } = req.query as unknown as JobFilters;

    // build dynamic filter
    const filter: any = {};

    if (location) {
      filter.location = { $regex: location, $options: 'i' }; // case-insensitive
    }

    if (jobType) {
      filter.jobType = jobType;
    }

    if (status) {
      filter.status = status;
    }

    // salary range
    if (minSalary || maxSalary) {
      filter.salary = {};

      if (minSalary) {
        filter.salary.$gte = Number(minSalary);
      }

      if (maxSalary) {
        filter.salary.$lte = Number(maxSalary);
      }
    }

    const jobs = await Job.find(filter).populate(
      'postedBy',
      'username email'
    );

    res.status(200).json({
      success: true,
      results: jobs.length,
      data: jobs,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err instanceof Error ? err.message : 'Failed to fetch jobs',
    });
  }
};






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
// const updateJob = async (req: Request, res: Response) => {

//     try {
//         const user = req.user;
//         const {id} = req.params;

//         const getJob = await Job.findById(id);

//         if (!getJob) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Job listing not found',
//             });
//         }

//         if (getJob.postedBy.toString() !== user?.userId) {
//             return res.status(403).json({
//                 success: false,
//                 message: 'Not authorized to update this job listing',
//             });
//         }

//         const jobUpdated = await Job.findByIdAndUpdate(id, req.body, { returnDocument: 'after', runValidators: true });

//         res.status(200).json({
//             success: true,
//             message: 'Job listing updated successfully',
//             data: jobUpdated,
//         });
    
//     } catch(error) {
//         res.status(500).json({
//             success: false,
//             message: 'Failed to update job listing',
//             error: error instanceof Error ? error.message : 'Failed to update job listing',
//         });
//     }

// }


// more strongly typed version of updateJob
const updateJob = async (
  req: Request<{ id: string }, {}, UpdateJobData>,
  res: Response
) => {
  try {
    const user = req.user;
    const { id } = req.params;

    // ✅ Validate ObjectId
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid job ID',
      });
    }

    // Single query (ownership + update)
    const updatedJob = await Job.findOneAndUpdate(
      { _id: id, postedBy: user?.userId } as any, // Type assertion to bypass Mongoose's type issues
      req.body,
      {
        returnDocument: 'after',
        runValidators: true,
      }
    );

    // Handle both "not found" and "not owner"
    if (!updatedJob) {
      return res.status(404).json({
        success: false,
        message: 'Job not found or not authorized',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Job listing updated successfully',
      data: updatedJob,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Failed to update job listing',
    });
  }
};







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