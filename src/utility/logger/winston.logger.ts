import { createLogger, format, transports, Logger } from "winston";
import { config } from "../../config";

const { combine, timestamp, colorize, errors, json, printf } = format;

class LoggerService {
    private static instance: LoggerService;
    private logger: Logger;
    private isDev: boolean;

    constructor() {
        this.isDev = config.isDev;
        this.logger = this.initializeLogger();
    }

    public static getInstance(): LoggerService {
        if (!LoggerService.instance) {
            LoggerService.instance = new LoggerService();
        }
        return LoggerService.instance;
    }

    private initializeLogger(): Logger {
        const devTransports = [
            new transports.Console({
                format: combine(
                    errors({ stack: true }),
                    colorize({ all: true }),
                    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
                    printf(({ level, message, timestamp, stack, service }) => {
                        return `[${timestamp}] ${level} (${service}) → ${stack || message}`;
                    })
                ),
            }),
        ];

        const prodTransports = [
            new transports.Console({
                format: combine(
                    timestamp(),
                    json()
                ),
            }),
        ];

        return createLogger({
            level: this.isDev ? "debug" : "info",
            defaultMeta: { service: config.appName },
            transports: this.isDev ? devTransports : prodTransports,
        });
    }

    public getLogger(): Logger {
        return this.logger;
    }
}

export const logger = LoggerService.getInstance().getLogger();