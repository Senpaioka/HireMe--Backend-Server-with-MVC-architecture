// Importing dependencies
import dotenv from 'dotenv';
import path from 'path';

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
  jwt_secret: requiredEnv('JWT_SECRET'),
  jwt_expires_in: requiredEnv('JWT_EXPIRES_IN'),
};
