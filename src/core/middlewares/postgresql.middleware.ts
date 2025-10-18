import { Prisma } from "../../../generated/prisma";
import { ApiError } from "../../utils/helpers";
import { ErrorMessage } from "../../utils/constants";

/**
 * Handles Prisma + PostgreSQL specific errors and maps them to
 * user-friendly API errors.
 */
export class PrismaPostgresErrorHandler {
    static handle(error: unknown): ApiError {
        // Non-Error objects (just in case)
        if (!(error instanceof Error)) {
            return ApiError.internal(ErrorMessage.INTERNAL_SERVER_ERROR);
        }

        // Prisma known errors (known request errors)
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            const code = error.code;

            switch (code) {
                case "P2002": {
                    // Unique constraint violation
                    const fields = (error.meta?.target as string[]) || ["field"];
                    return ApiError.conflict(
                        ErrorMessage.ALREADY_EXISTS("Resource", fields.join(", "))
                    );
                }

                case "P2003": {
                    // Foreign key constraint failed
                    const field = error.meta?.field_name || "foreign key";
                    return ApiError.validation(
                        ErrorMessage.DB_VALIDATION_ERROR(`Invalid relation for ${field}`)
                    );
                }

                case "P2000": {
                    // Value too long for column
                    return ApiError.validation(
                        ErrorMessage.DB_VALIDATION_ERROR("Value too long for column")
                    );
                }

                case "P2025": {
                    // Record not found
                    return ApiError.notFound(
                        ErrorMessage.RESOURCE_NOT_FOUND("Requested resource")
                    );
                }

                case "P2014": {
                    // Invalid nested write (relation error)
                    return ApiError.validation(
                        ErrorMessage.DB_VALIDATION_ERROR("Invalid nested relation")
                    );
                }

                case "P1001": {
                    // Database connection error
                    return ApiError.internal(
                        "Unable to reach PostgreSQL database. Check connection settings."
                    );
                }

                case "P1010":
                case "P1011":
                case "P1017": {
                    // Authentication or connection issues
                    return ApiError.internal(
                        "Database authentication or connection issue occurred."
                    );
                }

                default: {
                    // Any other Prisma-known errors
                    return ApiError.internal(ErrorMessage.INTERNAL_SERVER_ERROR);
                }
            }
        }

        // Prisma validation errors (invalid data provided to Prisma client)
        if (error instanceof Prisma.PrismaClientValidationError) {
            return ApiError.validation(
                ErrorMessage.DB_VALIDATION_ERROR(error.message)
            );
        }

        // Prisma initialization errors (client could not connect)
        if (error instanceof Prisma.PrismaClientInitializationError) {
            return ApiError.internal(
                "Database initialization failed. Check connection or configuration."
            );
        }

        // Prisma unknown errors (internal)
        if (error instanceof Prisma.PrismaClientUnknownRequestError) {
            return ApiError.internal(ErrorMessage.INTERNAL_SERVER_ERROR);
        }

        // Fallback for anything unexpected
        return ApiError.internal(ErrorMessage.INTERNAL_SERVER_ERROR);
    }
}
