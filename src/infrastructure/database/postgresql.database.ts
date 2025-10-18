import { PrismaClient } from "../../../generated/prisma";
import { config } from "../../config";
import { logger } from "../../utils/logger";
import { ApiError } from '../../utils/helpers';
import { IDatabasePostgreSQL } from '../../core/interfaces';

export class PostgreSQL implements IDatabasePostgreSQL {
    private static instance: PostgreSQL;
    private prisma?: PrismaClient;
    private isConnected: boolean = false;

    private constructor() { }

    public static getInstance(): PostgreSQL {
        if (!PostgreSQL.instance) {
            PostgreSQL.instance = new PostgreSQL();
        }
        return PostgreSQL.instance;
    }

    /**
     * Initialize and connect Prisma Client
     */
    public async connect(): Promise<void> {
        if (this.isConnected) {
            logger.warn({ service: "Database", message: "Already connected, skipping..." });
            return;
        }

        if (!config.databaseURL) {
            logger.error({ service: "Database", message: "Database URL missing in environment variables." });
            throw ApiError.internal();
        }

        try {
            logger.info({ service: 'Database', message: 'Initializing Prisma Client...'});

            this.prisma = new PrismaClient({
                datasources: {
                    db: { url: config.databaseURL },
                },
                log: config.databaseEnableLogging ? ['query', 'info', 'warn', 'error'] : [],
            });

            // Validate connection
            await this.prisma.$connect();
            this.isConnected = true;
            logger.info({ service: "Database", message: "Connected to PostgreSQL successfully." });
        } catch (error: any) {
            logger.error('Failed to connect Prisma to database:', error);
            this.isConnected = false;
            throw ApiError.internal();
        }
    }

    /**
     * Disconnect Prisma Client
     */
    public async disconnect(): Promise<void> {
        if (!this.prisma || !this.isConnected) {
            logger.warn({ service: "Database", message: "No active connection to disconnect." });
            return;
        }

        try {
            logger.info({ service: "Database", message: "Disconnecting Prisma..." });
            await this.prisma.$disconnect();
            this.prisma = undefined;
            this.isConnected = false;
            logger.info({ service: "Database", message: "Disconnected from PostgreSQL successfully." });
        } catch (error: any) {
            logger.error('Error disconnecting from Prisma database:', error);
            this.isConnected = false;
            throw ApiError.internal();
        }
    }

    /**
     * Lazy getter for Prisma instance
     */
    public get getDB(): PrismaClient {
        if (!this.prisma || !this.isConnected) {
            logger.error({ service: "Database", message: "Database not connected. Call connect() first." });
            throw ApiError.internal();
        }
        return this.prisma;
    }

    /**
     * Check if database is connected
     */
    public get isActive(): boolean {
        return this.isConnected;
    }

    /**
     * Health check - validates database connection
     */
    public async healthCheck(): Promise<boolean> {
        if (!this.prisma || !this.isConnected) {
            return false;
        }

        const start = Date.now();
        try {
            await this.prisma.$queryRaw`SELECT 1`;
            const duration = Date.now() - start;
            logger.info({ service: "Database", message: `Health check OK (${duration}ms)` });
            return true;
        } catch (error: any) {
            logger.error({
                service: "Database",
                message: `Health check failed: ${error.message}`,
            });
            return false;
        }
    }

    /**
     * Reconnect to database
     */
    public async reconnect(): Promise<void> {
        logger.info('Reconnecting to database...');
        await this.disconnect();
        await this.connect();
    }

}