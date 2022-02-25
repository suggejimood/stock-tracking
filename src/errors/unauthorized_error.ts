import { CustomError} from "./error_class/custom_error";

class UnauthorizedError extends CustomError {
    statusCode = 401;

    constructor(){
        super('Not Authorized');

        Object.setPrototypeOf(this, UnauthorizedError.prototype);
    }

    serializeErrors() {
        return [{ message: 'Not authorized' }];
    }
}

export { UnauthorizedError };