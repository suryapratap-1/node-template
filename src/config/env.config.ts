import dotenv from "dotenv";

/**
 * Load environment variables file
 * If the environment file is not found, it will log a warning message
 */
const isEnvDefined = dotenv.config();
if (!isEnvDefined) console.error("⚠️  Couldn't find .env file  ⚠️");

const { env } = process;

// Check required environment variables
const requiredEnvs = [
    "PORT",
    "HOST",
    "NODE_ENV",
    "EXPRESS_JSON_LIMIT",
    "EXPRESS_URLENCODED_LIMIT",
    "EXPRESS_STATIC_FOLDER_PATH",
    "EXPRESS_URLENCODED_EXTENDED",
    "MORGAN_MODE",
    "APP_NAME",
    "BASE_URL",
    "CORS_ORIGINS",
    "CORS_METHODS",
    "CORS_HEADERS",
    "CORS_CREDENTIALS",
    "DATABASE_URL",
    "DATABASE_ENABLE_LOGGING",
    "DATABASE_MAX_CONNECTIONS",
    "DATABASE_MIN_CONNECTIONS",
    "DATABASE_IDLE_TIMEOUT",
    "DATABASE_CONNECTION_TIMEOUT",
    "DATABASE_ALLOW_EXIT_ON_IDLE",
    "DATABASE_KEEP_ALIVE",
    "DATABASE_KEEP_ALIVE_INITIAL_DELAY",
];

/**
 * Function to check for missing required environment variables
 */
function checkRequiredEnvs(): void {
    const missing_envs: string[] = requiredEnvs.filter((key) => !env[key]);

    if (missing_envs.length) {
        console.error(
            "❌  Missing required environment variables:",
            missing_envs.join(", "),
            "  ❌",
        );
        process.exit(1);
    }
}
checkRequiredEnvs();


const _config = {
    // server
    port: Number(env.PORT),
    host: env.HOST as string,
    nodeEnv: env.NODE_ENV as string,
    isDev: env.NODE_ENV === "development",
    expressJsonLimit: env.EXPRESS_JSON_LIMIT as string,
    expressUrlencodedLimit: env.EXPRESS_URLENCODED_LIMIT as string,
    expressStaticPathFolder: env.EXPRESS_STATIC_FOLDER_PATH as string,
    expressUrlencodedExtended: Boolean(env.EXPRESS_URLENCODED_EXTENDED),
    morganMode: env.MORGAN_MODE as string,
    appName: env.APP_NAME as string,
    baseUrl: env.BASE_URL as string,

    // cors
    origins: env.CORS_ORIGINS?.split(",") as string[],
    methods: env.CORS_METHODS?.split(",") as string[],
    allowedHeaders: env.CORS_HEADERS?.split(",") as string[],
    credentials: Boolean(env.CORS_CREDENTIALS),

    // database
    databaseURL: env.DATABASE_URL as string,
    databaseEnableLogging: Boolean(env.DATABASE_ENABLE_LOGGING),
    databaseMaxConnections: Number(env.DATABASE_MAX_CONNECTIONS),
    databaseMinConnections: Number(env.DATABASE_MIN_CONNECTIONS),
    databaseIdleTimeout: Number(env.DATABASE_IDLE_TIMEOUT),
    databaseConnectionTimeout: Number(env.DATABASE_CONNECTION_TIMEOUT),
    databaseAllowExitOnIdle: Boolean(env.DATABASE_ALLOW_EXIT_ON_IDLE),
    databaseKeepAlive: Boolean(env.DATABASE_KEEP_ALIVE),
    databaseKeepAliveInitialDelay: Number(env.DATABASE_KEEP_ALIVE_INITIAL_DELAY),
}

export const config = Object.freeze(_config);