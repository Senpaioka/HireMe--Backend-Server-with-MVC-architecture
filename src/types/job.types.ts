import { Types } from "mongoose";
import { IUser } from "../types/user.types";


export interface IJob {
    _id?: string;

    title: string;
    description: string;

    company: string;
    location: string;

    salary?: number;

    jobType: 'full-time' | 'part-time' | 'contract' | 'internship';


    requirements: string[];
    responsibilities: string[];

    status?: 'open' | 'closed';
    postedBy: Types.ObjectId | IUser; // userId of the employer who posted the job

    createdAt?: Date;
    updatedAt?: Date;
}


// This type is used when creating a new job, as _id, postedBy, createdAt, and updatedAt are not required from the client side.
export type CreateJobData = {
  title: string;
  description: string;

  company: string;
  location: string;

  salary?: number;

  jobType: 'full-time' | 'part-time' | 'internship' | 'contract';

  requirements?: string[];
  responsibilities?: string[];

  status?: 'open' | 'closed';
};


// This type is used when updating an existing job, as all fields are optional and _id is not required from the client side.
export type UpdateJobData = Partial<CreateJobData>;



// This type is used for filtering job listings based on various criteria.
export interface JobFilters {
  location?: string;
  jobType?: string;
  minSalary?: number;
  maxSalary?: number;
  status?: 'open' | 'closed';
};