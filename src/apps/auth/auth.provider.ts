import {Container, Service} from "typedi";
import EErrorCode from "../../errors/codes";
import {TUser} from "../users/users.types";
import {UserProvider} from "../users/users.providers";
import {AppAuthenticationError} from "../../errors/auth";
import {JWTUtils} from "../../utils";


@Service()
export class AuthProvider {

    constructor(public userProvider: UserProvider) {
    }

    public async authUserWithEmailAndPassword(formData: { email: string, password: string }): Promise<string> {
        const user: TUser | null = await this.userProvider.getUserByEmail(formData.email);
        if (!user)
            throw new AppAuthenticationError(EErrorCode.UNAUTHENTICATED_USER_ERROR, "Invalid email and/or password!");

        const check = await this.userProvider.checkUserPassword(user.uid, formData.password);
        if (!check)
            throw new AppAuthenticationError(EErrorCode.UNAUTHENTICATED_USER_ERROR, "Invalid email and/or password!");

        const {uid, email, role} = user;
        const jwtUtils = Container.get(JWTUtils);
        return jwtUtils.generate({uid, email, role});
    }

}