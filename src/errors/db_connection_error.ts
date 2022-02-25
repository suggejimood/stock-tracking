import { CustomError } from "./error_class/custom_error";

class DbConnectionError extends CustomError {
    statusCode = 500;
    reason = "Error connecting to database";

    constructor(){
        super('Database connection error');

        Object.setPrototypeOf(this, DbConnectionError.prototype);
    }

    serializeErrors(){
        return [
            {message: this.reason}
        ]
    }
}

export { DbConnectionError };