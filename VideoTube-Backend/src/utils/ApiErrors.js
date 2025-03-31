class ApiError extends Error {
    constructor(statusCode, message, errors = [], stack="") {
        super();
        this.statusCode = statusCode;
        this.message = message;
        this.success = false;
        this.data = null,
        this.errors = errors;

        if(stack){
            this.stack = stack;
        } else{
            Error.captureStackTrace(this, this.constructor);
        }
    }
}


export { ApiError };
