import { CustomError } from "./error_class/custom_error";
import { ValidationError } from "express-validator";

class RequsetValidationError extends CustomError{
    statusCode = 404;

    constructor(public errors: ValidationError[]){
        super('Request validation error');

        Object.setPrototypeOf(this, RequsetValidationError.prototype);
    }

    serializeErrors(){
        return this.errors.map(err => { 
            return { message: err.msg, field: err.param };
        });
    }
}

export { RequsetValidationError };