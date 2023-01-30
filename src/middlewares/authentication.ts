import 'reflect-metadata';

import {Container} from "typedi";
import {JWTUtils} from "../utils";
import EErrorCode from "../errors/codes";
import {Request, Response} from "express";
import {AppAuthorizationError} from "../errors/auth";
import {AuthProvider} from "../apps/auth/auth.provider";
import {UserProvider} from "../apps/users/users.providers";
import {TUser, TUserPayload} from "../apps/users/users.types";


/**
 *
 * @param request
 * @constructor
 */
export async function AuthMiddleware(request: Request): Promise<void> {
    const jwtUtils = Container.get(JWTUtils);
    const userProvider = Container.get(UserProvider);

    const token = <string>request.cookies.access_token;
    if (!token) throw new AppAuthorizationError(
        EErrorCode.INVALID_TOKEN_ERROR, "Missing or invalid access token00"
    );

    const userPayload: TUserPayload = jwtUtils.verify(token);
    const user = await userProvider.getUserByUid(userPayload.uid);
    Reflect.set(request, "user", user);
}

/**
 *
 * @constructor
 * @param roles
 */
export function RoleAuthorize(roles: string[]): Function {
    return (request: Request): void => {
        const user: TUser = Object.getOwnPropertyDescriptor(request, 'user')?.value;
        if (!user || !user.role || !roles.includes(user.role))
            throw new AppAuthorizationError(
                EErrorCode.ACCESS_DENIED_ERROR,
                "User not defined or does not have enough rights"
            );
    }
}


/**
 *
 * @constructor
 */
export async function LoginRouteHandler(request: Request, response: Response) {
    const {email, password} = request.body;
    const authProvider = Container.get(AuthProvider);
    const token = await authProvider.authUserWithEmailAndPassword({email, password});

    response.cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.APP_ENIRONMENT === "production",
    });
}