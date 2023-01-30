import joi from "joi";

export const createUserForm = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required().min(8),
})