import { Types } from "mongoose";
import { IUser } from "./user.types";
import { IJob } from "./job.types";

export type ApplicationStatus = 'pending' | 'accepted' | 'rejected';

// DB shape
export interface IApplication {
    _id?: string;

    applicant: Types.ObjectId | IUser; // UserID (employee)
    job: Types.ObjectId | IJob; // Job ID

    coverLetter?: string;
    resumeUrl?: string;

    status: ApplicationStatus;

    createdAt?: Date;
    updatedAt?: Date;
};


export type CreateApplicationData = {
  job: string; // jobId (string from client)
  coverLetter?: string;
  resumeUrl?: string;
};


export type UpdateApplicationData = {
  status: ApplicationStatus;
};