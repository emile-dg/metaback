import Joi from "joi";
import {Request} from "express";
import AppValidationError from "../errors/validation";


/**
 *
 * @constructor
 */
export function FormValidationMiddleware(validationSchema: Joi.ObjectSchema): Function {
    return function FormValidationMiddleware(request: Request) {
        const validation = validationSchema.validate(request.body);
        if (validation.error) {
            const ctx = validation.error.details[0].context;
            throw new AppValidationError({key: ctx?.key, value: ctx?.value});
        }
        request.body = validation.value;
    };
}