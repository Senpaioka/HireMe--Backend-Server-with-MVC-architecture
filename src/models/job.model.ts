import { Schema, model, Types } from "mongoose";
import { IJob } from "../types/job.types";


// Define the Job schema based on the IJob interface
const jobSchema = new Schema<IJob>(
    {
        title: {type: String, required: true, trim: true},
        description: {type: String, required: true},
        company: {type: String, required: true},
        location: {type: String, required: true},
        salary: {type: Number, min: 0},
        jobType: {type: String, required: true, enum: ['full-time', 'part-time', 'contract', 'internship']},
        requirements: {type: [String], default: []},
        responsibilities: {type: [String], default: []},
        status: {type: String, enum: ['open', 'closed'], default: 'open'},
        postedBy: {type: Types.ObjectId, ref: 'User', required: true},
    },
    {
        timestamps: true,
    },
)


// Create the Job model
export const Job = model<IJob>('Job', jobSchema);