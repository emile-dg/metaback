import winston, { Logger } from "winston";

/**
 * Creates a logger for the application and make few adjustments
 * based on the environment the app is running on
 */
function createLogger(
	loggerService: string = "server.main",
	filePath: string = "./logs/combined.log",
	errorFilePath: string = "./logs/error.log"
): Logger {
	const _loggerLevel =
		process.env?.ENVIRONMENT === "production" ? "warning" : "debug";
	const { combine, timestamp, printf } = winston.format;
	const customFormat = printf(({ level, message, timestamp }) => {
		return `${timestamp} ${level}: ${message}`;
	});
	const logger = winston.createLogger({
		level: _loggerLevel,
		format: combine(timestamp(), customFormat),
		defaultMeta: { service: loggerService },
		transports: [
			new winston.transports.File({
				filename: errorFilePath,
				level: "error",
			}),
			new winston.transports.File({ filename: filePath }),
		],
	});

	// setup a console logger if we are in development
	if (process.env?.APP_ENVIRONMENT === "development")
		logger.add(
			new winston.transports.Console({ format: winston.format.simple() })
		);

	return logger;
}

export default createLogger;
