import { ZodError } from "zod";
import { HttpStatus, ErrorMessage } from "../constants/messages";

export class ApiError extends Error {
    public readonly statusCode: number;
    public readonly success: boolean;
    public readonly errors?: string[];

    constructor(
        statusCode: number,
        message?: string,
        errors?: string[],
        stack?: string
    ) {
        super(message);
        this.statusCode = statusCode;
        this.success = false;
        if (errors) this.errors = errors;

        stack ?
            (this.stack = stack) :
            (Error.captureStackTrace(this, this.constructor))
    }

    /**
     * Error handlers for different types of errors
     */
    static default(message: string) {
        return new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, message);
    }

    static badRequest(message: string = ErrorMessage.BAD_REQUEST, errors = []) {
        return new ApiError(HttpStatus.BAD_REQUEST, message, errors);
    }

    static unauthorized(message: string = ErrorMessage.UNAUTHORIZED) {
        return new ApiError(HttpStatus.UNAUTHORIZED, message);
    }

    static forbidden(message: string = ErrorMessage.FORBIDDEN) {
        return new ApiError(HttpStatus.FORBIDDEN, message);
    }

    static notFound(entity: string = "Resource") {
        return new ApiError(
            HttpStatus.NOT_FOUND,
            ErrorMessage.RESOURCE_NOT_FOUND(entity)
        );
    }

    static conflict(message: string = ErrorMessage.CONFLICT) {
        return new ApiError(HttpStatus.CONFLICT, message);
    }

    static internal(message: string = ErrorMessage.INTERNAL_SERVER_ERROR) {
        return new ApiError(HttpStatus.INTERNAL_SERVER_ERROR, message);
    }

    static validation(message: string = ErrorMessage.VALIDATION_ERROR, errors = []) {
        return new ApiError(HttpStatus.VALIDATION_ERROR, message, errors);
    }

    static duplicateKey(entity: string, field: string) {
        return new ApiError(
            HttpStatus.CONFLICT,
            ErrorMessage.ALREADY_EXISTS(entity, field)
        );
    }

    static missing(field: string[]) {
        return new ApiError(
            HttpStatus.VALIDATION_ERROR,
            ErrorMessage.VALIDATION_ERROR,
            ErrorMessage.MISSING(field)
        );
    }

    static handleZodError(error: any) {
        if (error instanceof ZodError) {
            const formattedErrors: any = error.issues.map((issue: any) =>
                `${issue.path.join('.')} is ${issue.message.toLowerCase()}`
            );
            return ApiError.validation(ErrorMessage.VALIDATION_ERROR, formattedErrors);
        }
        return ApiError.badRequest(ErrorMessage.BAD_REQUEST);
    }

    static handleArgon2Error(error: any) {
        if (error instanceof Error) {
            const message = error.message.toLowerCase();

            if (
                message.includes('invalid hash') ||
                message.includes('decoding failed')
            ) {
                return ApiError.badRequest(ErrorMessage.PASSWORD_VERIFICATION_FAILED);
            }
            else if (message.includes('verification failed')) {
                return ApiError.unauthorized(ErrorMessage.PASSWORD_VERIFICATION_FAILED);
            }

            // fallback
            return ApiError.internal(ErrorMessage.AUTH_HASHING_ERROR);
        }
    }

}