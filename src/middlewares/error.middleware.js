import { NODE_ENV } from "../config/env/env.js";

const errorMiddleware = (err, req, res, next) => {

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    logger.error("API Error", {
        message,
        statusCode,
        method: req.method,
        url: req.originalUrl,
        userId: req.user?.id || null,
        stack: err.stack
    });

    if (err.name === 'ValidationError') {
        const errors = {};
        Object.keys(err.errors).forEach((key) => {
            errors[key] = err.errors[key].message;
        });

        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
    }

    if (err.code === 11000) {
        const value = err.keyValue ? Object.values(err.keyValue)[0] : 'duplicate value';
        return res.status(400).json({
            success: false,
            message: `Duplicate field value: ${value}`
        });
    }

    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
        return res.status(401).json({
            success: false,
            message: "Unauthorized - Token issue"
        });
    }

    return res.status(statusCode).json({
        success: false,
        message: statusCode === 500 && NODE_ENV === 'production'
            ? "Something went wrong"
            : message
    });
};

export default errorMiddleware;