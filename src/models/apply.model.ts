import { Types, Schema, model } from "mongoose";
import { IApplication, ApplicationStatus } from "../types/apply.types";

const applicationSchema = new Schema<IApplication>(
  {
    applicant: {
      type: Types.ObjectId,
      ref: 'User',
      required: true,
    },

    job: {
      type: Types.ObjectId,
      ref: 'Job',
      required: true,
    },

    coverLetter: {
      type: String,
      trim: true,
    },

    resumeUrl: {
      type: String, // URL or file path
    },

    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'] as ApplicationStatus[],
      default: 'pending',
    },
  },
  {
    timestamps: true,
  }
);


// Prevent duplicate applications (VERY IMPORTANT)
applicationSchema.index(
  { applicant: 1, job: 1 },
  { unique: true }
);

// Create the model
const Application = model<IApplication>('Application', applicationSchema);
export default Application;

