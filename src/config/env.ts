// Importing dependencies
import dotenv from 'dotenv';
import path from 'path';
import { StringValue } from 'ms'; 

// Loading .env file
dotenv.config({path: path.join(process.cwd(), '.env')});


// verifying required environment variables
const requiredEnv = (key: string): string => {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing environment variable: ${key}`);
    }
    return value;
};

// Exporting configuration object
export default {
  port: Number(process.env.PORT) || 5000,
  database_url: requiredEnv('MONGODB_URI'),
  bcrypt_salt_rounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 12,
  jwt_secret: requiredEnv('JWT_SECRET') as string,
  jwt_expires_in: (process.env.JWT_EXPIRES_IN ?? '1h') as StringValue,
  openai_api_key: requiredEnv('OPENAI_API_KEY') as string,
};

