import {Service} from "typedi";
import {sign, verify} from "jsonwebtoken";

import EErrorCode from "./errors/codes";
import {AppAuthenticationError} from "./errors/auth";
import {TUserPayload} from "./apps/users/users.types";

@Service()
export class JWTUtils {
    private readonly jwtSecretKey: string;

    constructor() {
        this.jwtSecretKey = <string>process.env?.APP_SECRET_KEY;
    }


    /**
     * @function
     * @name generate
     * @param userDetails
     * @returns
     */
    generate(userDetails: any) {
        return sign(Object.assign({}, userDetails), this.jwtSecretKey, {
            expiresIn: "1h"
        });
    }


    /**
     *
     * @param token
     */
    verify(token: string): TUserPayload {
        try {
            return <TUserPayload>verify(token, this.jwtSecretKey);
        } catch (e) {
            throw new AppAuthenticationError(
                EErrorCode.INVALID_TOKEN_ERROR, "Invalid or Expired token"
            );
        }
    }
}
