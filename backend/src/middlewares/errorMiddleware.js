const errorMiddleware = (err, req, res, next) => {
    const defaultError = {
        statusCode: 500, // Default to internal server error
        success: "failed",
        message: "Something went wrong",
    };

    if (err.name === "ValidationError") {
        defaultError.statusCode = 400; // Bad request
        defaultError.message = Object.values(err.errors)
            .map((el) => el.message)
            .join(", ");
    }

    if (err.code && err.code === 11000) {
        defaultError.statusCode = 400; // Bad request
        defaultError.message = `${Object.values(err.keyValue)} field has to be unique!`;
    }

    res.status(defaultError.statusCode).json({
        success: defaultError.success,
        message: defaultError.message,
    });
};

export default errorMiddleware;
