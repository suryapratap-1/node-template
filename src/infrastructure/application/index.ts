import { Bootstrap } from "./bootstrap";
import { logger } from "./infrastructure/logger";

class Application {
    private static instance: Application;
    private bootstrap: Bootstrap;

    private constructor() {
        this.bootstrap = Bootstrap.getInstance();
    }

    public static getInstance(): Application {
        if (!Application.instance) {
            Application.instance = new Application();
        }
        return Application.instance;
    }

    public async start(): Promise<void> {
        try {
            logger.info("Starting application...");
            await this.bootstrap.start();
            logger.info("Application started successfully");
        } catch (error: any) {
            logger.error("Application failed to start:", error);
            throw error;
        }
    }

    public getBootstrap(): Bootstrap {
        return this.bootstrap;
    }
}

// Start the application
(async () => {
    const app = Application.getInstance();

    try {
        await app.start();
    } catch (error: any) {
        logger.error("Fatal error during startup:", error);
        process.exit(1);
    }
})();