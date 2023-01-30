import VARS from "../vars";
import AppBaseError from "./base";
import EErrorCode from "./codes";

export interface IAppValidationErrorOptions {
    code?: EErrorCode;
    key?: string;
    value?: string;
    message?: string;
}

export default class AppValidationError extends AppBaseError {
    static CODE = EErrorCode.VALIDATION_ERROR;
    static DEFAULT_MESSAGE = "Input validation error";

    __ERROR_CODE: EErrorCode;

    private readonly key: string | undefined;
    private readonly keyValue: string | undefined;

    constructor({code = EErrorCode.VALIDATION_ERROR, message = "Invalid form data", key, value}: IAppValidationErrorOptions) {
        super({code, message});
        this.key = key;
        this.keyValue = value;

        this.__ERROR_CODE = code;
        this.__isOperational = true;
        this.__STATUS_CODE = VARS.CBAD_REQUEST;
        this.__ERROR_MESSAGE = message || AppValidationError.DEFAULT_MESSAGE;
    }

    get responseBody() {
        return {
            code: this.__ERROR_CODE,
            message: this.errorMessage,
            isOperational: this.__isOperational,

            key: this.key,
            value: this.keyValue,
        };
    }
}
