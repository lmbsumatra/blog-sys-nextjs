import { createLogger, format, transports } from 'winston';

const { combine, timestamp, printf, colorize } = format;

const logFormat = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level}]: ${message}`;
});

const logger = createLogger({
    level: 'http', // info: logs higher level: info, error, warning,
                   // can be changed into lower by using 'http'
    levels: {
        http: 0,
        error: 1,
        warn: 2,
        info: 3,
        debug: 4,
        logicError: 5,  // used on try-catch
    },
    format: combine(
        colorize(),
        timestamp(),
        logFormat
    ),
    // prints to console, file to save/log
    transports: [
        // new transports.Console(),
        new transports.File({ filename: 'logs/error.log', level: 'error' }),
        new transports.File({ filename: 'logs/combined.log' })
    ],
});

export default logger;
