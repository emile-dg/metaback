import VARS from "../vars";
import AppBaseError from "./base";
import EErrorCode from "./codes";

export class AppAuthenticationError extends AppBaseError {
    constructor(code: EErrorCode = EErrorCode.UNAUTHENTICATED_USER_ERROR, message: string) {
        super({code, message});
        this.__isOperational = true;
        this.__ERROR_MESSAGE = message;
        this.__STATUS_CODE = VARS.CUNAUTHENTICATED_USER;
    }
}

export class AppAuthorizationError extends AppBaseError {
    constructor(code: EErrorCode = EErrorCode.ACCESS_DENIED_ERROR, message: string = "Access denied") {
        super({code, message});
        this.__isOperational = true;
        this.__ERROR_MESSAGE = message;
        this.__STATUS_CODE = VARS.CUNAUTHORIZED_ACCESS;
    }
}
