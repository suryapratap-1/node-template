import { Server } from "http";
import { Application } from "express";
import { app } from "./app";
import { ShutdownManager } from "./shutdown";
import { config } from "../../config";
import { logger } from "../../utils/logger";
import { IDatabasePostgreSQL } from "../../core/interfaces";
import { ApiError } from "../../utils/helpers";
import { errorMiddleware } from "../../core/middlewares";
import { PostgreSQL } from "../database";
// import { V1RouterManager } from "./api";

export class Bootstrap {
    private static instance: Bootstrap;
    private server: Server | null = null;
    private app: Application;
    private databaseClient: IDatabasePostgreSQL;
    private shutdownManager: ShutdownManager;
    // private routerManager: V1RouterManager;
    private isRunning: boolean = false;

    private constructor() {
        this.app = app;
        this.databaseClient = PostgreSQL.getInstance();
        this.shutdownManager = ShutdownManager.getInstance();
        // this.routerManager = new V1RouterManager(this.app);
    }

    public static getInstance(): Bootstrap {
        if (!Bootstrap.instance) {
            Bootstrap.instance = new Bootstrap();
        }
        return Bootstrap.instance;
    }

    public async start(): Promise<void> {
        if (this.isRunning) {
            logger.warn("Bootstrap already running, skipping...");
            return;
        }

        try {
            await this.connectDatabase();
            await this.setupRoutes();
            this.setupErrorHandlers();
            await this.startServer();
            this.setupGracefulShutdown();
            this.isRunning = true;
        } catch (error: any) {
            logger.error("Bootstrap failed: ", error);
            throw error;
        }
    }

    private async connectDatabase(): Promise<void> {
        logger.info("Connecting to database...");
        await this.databaseClient.connect();
        logger.info("Database connected successfully");
    }

    private async setupRoutes(): Promise<void> {
        logger.info("Initializing routes...");
        // this.routerManager.initialize();
        logger.info("Routes initialized successfully");
    }

    private setupErrorHandlers(): void {
        // Not Found Handler
        this.app.use((req, _res, next) => {
            next(ApiError.badRequest(`Route not found: ${req.url}`));
        });

        // Global Error Handler
        this.app.use(errorMiddleware);
        logger.info("Error handlers configured");
    }

    private async startServer(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.server = this.app.listen(config.port, config.host, () => {
                    logger.info(`Server is running on ${config.baseUrl}`);
                    resolve();
                });

                this.server.on("error", (error: any) => {
                    logger.error("Server error:", error);
                    reject(error);
                });
            } catch (error) {
                reject(error);
            }
        });
    }

    private setupGracefulShutdown(): void {
        process.on("SIGINT", () => this.handleShutdown("SIGINT"));
        process.on("SIGTERM", () => this.handleShutdown("SIGTERM"));
        process.on("uncaughtException", (error: any) => {
            logger.error("Uncaught Exception:", error);
            this.handleShutdown("uncaughtException");
        });
        process.on("unhandledRejection", (reason: any) => {
            logger.error("Unhandled Rejection:", reason);
            this.handleShutdown("unhandledRejection");
        });
        logger.info("Graceful shutdown hooks configured");
    }

    private async handleShutdown(signal: string): Promise<void> {
        if (this.server) {
            await this.shutdownManager.shutdown(signal, this.databaseClient, this.server);
        } else {
            logger.warn("No server instance to shut down");
            process.exit(1);
        }
    }

    public getServer(): Server | null {
        return this.server;
    }

    public getApp(): Application {
        return this.app;
    }

    public isServerRunning(): boolean {
        return this.isRunning;
    }
}
