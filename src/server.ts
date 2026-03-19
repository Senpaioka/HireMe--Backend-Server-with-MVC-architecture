import mongoose from "mongoose";
import app from "./app";
import config from "./config/env";

const main = async () => {
    try {
        // validate env variables
        if(!config.database_url){
            throw new Error("Database URL is not defined in environment variables.");
        }

        // connect to MongoDB
        await mongoose.connect(config.database_url);
        console.log("Connected to MongoDB");

        // start express server
        const server = app.listen(config.port, () => {
            console.log(`Server is running on port ${config.port}`);
        });

        // handle graceful shutdown
        const shutdown = async (signal: string) => {
            console.log(`Received ${signal}. Shutting down gracefully...`);

            try {
                await mongoose.connection.close();
                console.log("MongoDB connection closed.");

                server.close(() => {
                    console.log("HTTP server closed.");
                    process.exit(0);
                });
            } catch (error) {
                console.error("Error occurred while shutting down:", error);
                process.exit(1);
            }
        };

        // Listen for termination signals
        process.on("SIGTERM", () => shutdown("SIGTERM")); // Docker and Kubernetes send SIGTERM for graceful shutdown
        process.on("SIGINT", () => shutdown("SIGINT")); // Ctrl+C in terminal sends SIGINT

    } catch (error) {
        console.error("Error occurred while starting the server:", error);
        process.exit(1);
    }
};

main();
