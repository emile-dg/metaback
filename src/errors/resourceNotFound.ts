import VARS from "../vars";
import AppBaseError from "./base";
import EErrorCode from "./codes";

class AppResourceNotFoundError extends AppBaseError {
    constructor(code: EErrorCode = EErrorCode.RESOURCE_NOT_FOUND_ERROR, message: string) {
        super({code, message});
        this.__isOperational = true;
        this.__ERROR_MESSAGE = message;
        this.__STATUS_CODE = VARS.CUNAUTHORIZED_ACCESS;
    }
}

export default AppResourceNotFoundError;
