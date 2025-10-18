import { Server } from "http";
import { logger } from "../../utils/logger";
import { IDatabasePostgreSQL } from "../../core/interfaces";

export class ShutdownManager {
    private static instance: ShutdownManager;
    private isShuttingDown: boolean = false;
    private shutdownTimeout: number = 10000; // 10 seconds

    private constructor() { }

    public static getInstance(): ShutdownManager {
        if (!ShutdownManager.instance) {
            ShutdownManager.instance = new ShutdownManager();
        }
        return ShutdownManager.instance;
    }

    public async shutdown(
        signal: string,
        dbClient: IDatabasePostgreSQL,
        server: Server
    ): Promise<void> {
        if (this.isShuttingDown) {
            logger.warn("Shutdown already in progress...");
            return;
        }

        this.isShuttingDown = true;
        logger.info(`Received ${signal}, initiating graceful shutdown...`);

        // Set a timeout to force shutdown if graceful shutdown takes too long
        const forceShutdownTimeout = setTimeout(() => {
            logger.error("Graceful shutdown timeout exceeded, forcing exit...");
            process.exit(1);
        }, this.shutdownTimeout);

        try {
            await this.closeDatabase(dbClient);
            await this.closeServer(server);

            clearTimeout(forceShutdownTimeout);
            logger.info("Server successfully shut down.");
            process.exit(0);
        } catch (error: any) {
            clearTimeout(forceShutdownTimeout);
            logger.error("Error during shutdown:", error);
            process.exit(1);
        }
    }

    private async closeDatabase(dbClient: IDatabasePostgreSQL): Promise<void> {
        try {
            logger.info("Closing database connection...");
            if (dbClient.isActive) await dbClient.disconnect();
            logger.info("Database connection closed");
        } catch (error: any) {
            logger.error("Error closing database:", error);
            throw error;
        }
    }

    private async closeServer(server: Server): Promise<void> {
        return new Promise((resolve, reject) => {
            logger.info("Closing server...");
            server.close((error: any) => {
                if (error) {
                    logger.error("Error closing server:", error);
                    reject(error);
                } else {
                    logger.info("Server closed");
                    resolve();
                }
            });
        });
    }

    public setShutdownTimeout(timeout: number): void {
        this.shutdownTimeout = timeout;
    }

    public getShutdownTimeout(): number {
        return this.shutdownTimeout;
    }

    public isShutdownInProgress(): boolean {
        return this.isShuttingDown;
    }
}