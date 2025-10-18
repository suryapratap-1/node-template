import express, { Application } from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import { config } from "../../config";

class ExpressApp {
    private static instance: ExpressApp;
    private app: Application;

    private constructor() {
        this.app = express();
        this.initializeMiddlewares();
    }

    public static getInstance(): ExpressApp {
        if (!ExpressApp.instance) {
            ExpressApp.instance = new ExpressApp();
        }
        return ExpressApp.instance;
    }

    private initializeMiddlewares(): void {
        this.setupSecurity();
        this.setupCORS();
        this.setupParsers();
        this.setupStaticFiles();
        this.setupLogger();
    }

    private setupSecurity(): void {
        this.app.use(helmet());
    }

    private setupCORS(): void {
        this.app.use(cors({
            origin: config.origins,
            methods: config.methods,
            allowedHeaders: config.allowedHeaders,
            credentials: config.credentials,
        }));
    }

    private setupParsers(): void {
        this.app.use(express.json({ limit: config.expressJsonLimit }));
        this.app.use(express.urlencoded({
            extended: config.expressUrlencodedExtended,
            limit: config.expressUrlencodedLimit
        }));
    }

    private setupStaticFiles(): void {
        this.app.use(express.static(config.expressStaticPathFolder));
    }

    private setupLogger(): void {
        this.app.use(morgan(config.morganMode));
    }

    public getApp(): Application {
        return this.app;
    }
}

// Export the singleton instance's app
export const app = ExpressApp.getInstance().getApp();
