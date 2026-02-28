import winston from 'winston';
import { LOG_LEVEL, NODE_ENV } from '../config/env/env.js';

const logger = winston.createLogger({
    level: LOG_LEVEL,

    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),

    defaultMeta: {
        service: 'auth-service',
        environment: NODE_ENV
    },

    transports: [
        new winston.transports.Console()
    ]
});

export default logger;
