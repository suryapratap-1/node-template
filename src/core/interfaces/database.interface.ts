import { PrismaClient } from "@prisma/client";

/**
 * Database interface
 */
export interface IDatabase {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
}

/**
 * Interface for PostgreSQL database connection layer using Prisma ORM.
 * Defines the contract for database lifecycle management, health checks,
 * and Prisma Client access.
 */
export interface IDatabasePostgreSQL {
    /**
     * Connect to the PostgreSQL database using Prisma Client.
     * Should be called once during application startup.
     * @throws {ApiError} If connection fails or URL is missing.
     */
    connect(): Promise<void>;

    /**
     * Disconnect Prisma Client and cleanup resources.
     * Should be called during application shutdown.
     * @throws {ApiError} If disconnection fails.
     */
    disconnect(): Promise<void>;

    /**
     * Lazily retrieves the active Prisma Client instance.
     * @throws {ApiError} If database is not yet connected.
     */
    readonly getDB: PrismaClient;

    /**
     * Returns the current connection status.
     * `true` if connected, otherwise `false`.
     */
    readonly isActive: boolean;

    /**
     * Performs a health check query (`SELECT 1`) to validate database connectivity.
     * @returns {Promise<boolean>} `true` if healthy, `false` otherwise.
     */
    healthCheck(): Promise<boolean>;

    /**
     * Forces a reconnection by disconnecting and reinitializing Prisma Client.
     */
    reconnect(): Promise<void>;
}
