import { Request, Response } from "express";
import { config } from "../../config";
import { ApiError } from "../../utils/helpers";
import { logger } from "../../utils/logger";
import { PrismaPostgresErrorHandler } from "./postgresql.middleware";

type ErrorResponse = {
    success: boolean;
    message: string;
    errors?: string[];
    stack?: string
}

const sendError = (payload: ApiError, res: Response) => {
    const response: ErrorResponse = {
        success: payload.success,
        message: payload.message,
    }
    // Send field-level errors only for user-centric validation
    if (payload.errors && payload.errors.length > 0) {
        response.errors = payload.errors;
    }
    // Show stack trace only in dev mode
    if (config.isDev) response.stack = payload.stack
    return res.status(payload.statusCode).json(response);
}



export const errorMiddleware = (err: any, req: Request, res: Response) => {
    let normalizedError: ApiError;

    logger.error({
        path: req.originalUrl,
        method: req.method,
        type: err.constructor?.name || typeof err,
        message: err.message,
        stack: err.stack,
        raw: err, // keep full object for inspection
    });

    if (err?.name?.startsWith("Mongo")) {
        normalizedError = PrismaPostgresErrorHandler.handle(err);
    } else if (err instanceof ApiError) {
        normalizedError = err;
    } else {
        normalizedError = ApiError.internal();
    }

    // Send safe response to client
    sendError(normalizedError, res);
}
