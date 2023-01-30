import AppBaseError from "../errors/base";
import {NextFunction, Request, Response} from "express";
import AppInternalServerError from "../errors/internal";
import createLogger from "../logger";
import EErrorCode from "../errors/codes";

const __logger = createLogger("error.middleware");

/**
 *
 * @param error
 * @param request
 * @param response
 * @param _next
 */
export default function appErrorhandler(
    error: AppBaseError | Error,
    request: Request,
    response: Response,
    _next: NextFunction
) {
    const env = process.env?.APP_ENVIRONMENT;

    // log to the error log file
    __logger.error(error.message);

    let errorToReturn: AppBaseError;

    if (error instanceof AppBaseError)
        errorToReturn = error;
    else
        errorToReturn = new AppInternalServerError(EErrorCode.INTERNAL_SERVER_ERROR, error.message);


    return response.status(500).json({
        error: {
            ...errorToReturn.responseBody,
            ...(env === "development" && {debug: error.message}),
        },
    });
}
