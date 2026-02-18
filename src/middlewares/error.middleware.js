const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack); // Log the error for debugging

    // Handle Mongoose Validation Errors
    if (err.name === 'ValidationError') {
        const errors = {};
        Object.keys(err.errors).forEach((key) => {
            errors[key] = err.errors[key].message;
        });

        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors,
        });
    }

    // Handle Mongoose duplicate key errors (code 11000)
    if (err.code === 11000) {
        const value = err.keyValue ? Object.values(err.keyValue)[0] : 'duplicate value';
        return res.status(400).json({
            success: false,
            message: `Duplicate field value: ${value}. Please use another value.`,
        });
    }

    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: `Invalid ${err.path}: ${err.value}.`,
        });
    }

    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
        return res.status(401).json({
            success: false,
            message: "Unauthorized - Token issue",
        });
    }

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    return res.status(statusCode).json({
        success: false,
        message: message,
    });

}

export default errorMiddleware;