import IAppError from "../interfaces/AppError";
import EErrorCode from "./codes";

export interface IAppErrorOptions {
	code: EErrorCode;
	message?: string;
}

export default class AppBaseError extends Error {
	__ERROR_CODE: EErrorCode;
	__STATUS_CODE: number;
	__isOperational: boolean;
	__ERROR_MESSAGE: string | undefined;

	constructor({ message, code }: IAppErrorOptions) {
		super(message);
		this.__STATUS_CODE = 0;
		this.__ERROR_CODE = code;
		this.__isOperational = false;
		this.__ERROR_MESSAGE = message;
	}

	get statusCode() {
		return this.__STATUS_CODE;
	}

	get errorMessage() {
		return this.__ERROR_MESSAGE;
	}

	get code() {
		return this.__ERROR_CODE;
	}

	get isOperational() {
		return this.__isOperational;
	}

	get responseBody(): IAppError {
		return {
			code: this.code,
			message: this.errorMessage,
			isOperational: this.isOperational,
		};
	}
}