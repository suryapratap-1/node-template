export const HttpStatus = {
    // Client Errors
    BAD_REQUEST: 400 as number,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    VALIDATION_ERROR: Number(422),

    // Success Responses
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,

    // Server Errors
    INTERNAL_SERVER_ERROR: 500,
} as const;


export const ErrorMessage = {
    BAD_REQUEST: "Bad Request",
    UNAUTHORIZED: "Unauthorized Access",
    FORBIDDEN: "Forbidden",
    NOT_FOUND: "Not Found",
    CONFLICT: "Conflict",
    VALIDATION_ERROR: "Validation failed",
    VALIDATION_FAILED: "Validation failed",
    INVALID_CREDENTIALS: "Invalid credentials",
    INVALID_PASSWORD: "Passoword is invalid",
    INVALID_PASSWORD_HASH: "Invalid password hash",
    PASSWORD_VERIFICATION_FAILED: "Password verification failed",
    HASH_DECODE_FAILED: "Password hash could not be decoded",
    AUTH_HASHING_ERROR: "Authentication failed due to a hashing error",
    INTERNAL_SERVER_ERROR: "We're having an issue on our end, please try again later.",
    ALREADY_EXISTS: (enity: string, field: string) => `${enity} with this ${field} already exists`,
    MISSING: (field: string[]) => field.map(key => `${key} is required`),
    RESOURCE_NOT_FOUND: (entity: string) => `${entity} not found`,

    // Database errors
    DB_TRANSACTION_FAILED: (code: string, msg: string) => `Database transaction failed: ${code} - ${msg}`,
    DB_VALIDATION_ERROR: (msg: string) => `Validation error: ${msg}`,
    DB_INIT_FAILED: "Database initialization failed.",
    DB_CRASH: "Unexpected database crash.",
    MALFORMED_QUERY: "Internal Server Error.",
    DB_FAILED: "Database operation failed.",
} as const;


export const SuccessMessage = {
    // Generic Success Messages
    OK: "Request processed successfully",
    CREATED: "Resource created successfully",
    UPDATED: "Resource updated successfully",
    DELETED: "Resource deleted successfully",
    ACCEPTED: "Request accepted for processing",
    NO_CONTENT: "Operation completed successfully",
    GENERATED: "Resource generated successfully",

    // Authentication & Authorization
    LOGIN_SUCCESS: "Login successful",
    LOGOUT_SUCCESS: "Logout successful",
    TOKEN_REFRESHED: "Access token refreshed successfully",
    PASSWORD_CHANGED: "Password has changed successfully",
    PASSWORD_RESET: "Password reset successful",
    EMAIL_VERIFIED: "Email verified successfully",
    ACCOUNT_ACTIVATED: "Account activated successfully",

    // User Management
    USER_REGISTERED: "User registered successfully",
    USER_PROFILE_UPDATED: "User profile updated successfully",
    USER_PREFERENCES_SAVED: "User preferences saved successfully",
    USER_AVATAR_UPLOADED: "Profile picture uploaded successfully",

    // Referral System
    REFERRAL_CODE_GENERATED: "Referral code generated successfully",
    REFERRAL_LINK_CREATED: "Referral link created successfully",
    REFERRAL_QR_GENERATED: "Referral QR code generated successfully",
    REFERRAL_APPLIED: "Referral code applied successfully",
    REFERRAL_REWARD_CREDITED: "Referral reward credited to your account",

    // Wallet Management
    WALLET_CREATED: "Wallet created successfully",
    WALLET_BALANCE_ADDED: "Wallet balance added successfully",
    WALLET_BALANCE_REDEEMED: "Wallet balance redeemed successfully",

    // Booking & Reservations
    BOOKING_CREATED: "Booking created successfully",
    BOOKING_CONFIRMED: "Booking confirmed successfully",
    BOOKING_CANCELLED: "Booking cancelled successfully",
    BOOKING_MODIFIED: "Booking modified successfully",
    PAYMENT_PROCESSED: "Payment processed successfully",
    REFUND_INITIATED: "Refund initiated successfully",

    // Hospitality Specific
    ROOM_ASSIGNED: "Room assigned successfully",
    CHECK_IN_COMPLETED: "Check-in completed successfully",
    CHECK_OUT_COMPLETED: "Check-out completed successfully",
    SERVICE_REQUEST_SUBMITTED: "Service request submitted successfully",
    FEEDBACK_SUBMITTED: "Feedback submitted successfully",
    LOYALTY_POINTS_EARNED: "Loyalty points earned successfully",

    // Data Operations
    DATA_IMPORTED: "Data imported successfully",
    DATA_EXPORTED: "Data exported successfully",
    DATA_SYNCED: "Data synchronized successfully",
    BACKUP_CREATED: "Backup created successfully",
    CACHE_CLEARED: "Cache cleared successfully",

    // Notifications
    NOTIFICATION_SENT: "Notification sent successfully",
    EMAIL_SENT: "Email sent successfully",
    SMS_SENT: "SMS sent successfully",
    PUSH_NOTIFICATION_SENT: "Push notification sent successfully",

    // File Operations
    FILE_UPLOADED: "File uploaded successfully",
    FILE_DELETED: "File deleted successfully",
    IMAGE_PROCESSED: "Image processed successfully",
    DOCUMENT_GENERATED: "Document generated successfully",

    // Dynamic Success Messages
    RESOURCE_CREATED: (entity: string) => `${entity} created successfully`,
    RESOURCE_UPDATED: (entity: string) => `${entity} updated successfully`,
    RESOURCE_DELETED: (entity: string) => `${entity} deleted successfully`,
    RESOURCE_RETRIEVED: (entity: string) => `${entity} retrieved successfully`,
    OPERATION_COMPLETED: (operation: string) => `${operation} completed successfully`,

    // Database Success Messages
    DB_CONNECTION_SUCCESS: "Database connected successfully",
    DB_TRANSACTION_SUCCESS: "Database transaction completed successfully",
    DB_BACKUP_SUCCESS: "Database backup completed successfully",
    DB_MIGRATION_SUCCESS: "Database migration completed successfully",
    DB_SEED_SUCCESS: "Database seeding completed successfully",

    // Batch Operations
    BULK_CREATE_SUCCESS: (count: number, entity: string) => `${count} ${entity}(s) created successfully`,
    BULK_UPDATE_SUCCESS: (count: number, entity: string) => `${count} ${entity}(s) updated successfully`,
    BULK_DELETE_SUCCESS: (count: number, entity: string) => `${count} ${entity}(s) deleted successfully`,

    // Pagination & Search
    SEARCH_COMPLETED: (count: number, entity: string) => `Found ${count} ${entity}(s) matching your criteria`,
    PAGE_RETRIEVED: (page: number, total: number) => `Page ${page} of ${total} retrieved successfully`,

    // Integration & External Services
    THIRD_PARTY_SYNC_SUCCESS: (service: string) => `Successfully synchronized with ${service}`,
    API_INTEGRATION_SUCCESS: (api: string) => `${api} integration completed successfully`,
    WEBHOOK_DELIVERED: (endpoint: string) => `Webhook delivered to ${endpoint} successfully`,

    // Hospitality Business Logic
    GUEST_CHECKED_IN: (guestName: string, room: string) => `${guestName} checked in to room ${room} successfully`,
    GUEST_CHECKED_OUT: (guestName: string) => `${guestName} checked out successfully`,
    ROOM_CLEANED: (roomNumber: string) => `Room ${roomNumber} marked as cleaned`,
    BOOKING_CONFIRMED_WITH_DETAILS: (bookingId: string, dates: string) => `Booking ${bookingId} confirmed for ${dates}`,
    PAYMENT_CONFIRMED: (amount: number, method: string) => `Payment of $${amount} via ${method} processed successfully`,
} as const;