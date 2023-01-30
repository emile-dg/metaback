import {Service} from "typedi";
import {Resource} from "../../libs/app.decorators";
import {FormValidationMiddleware} from "../../middlewares/formValidation";
import {RouteHandler, RouteHandlerMiddlewares} from "../../libs/app.utils";
import {AuthMiddleware, RoleAuthorize} from "../../middlewares/authentication";

import {createUserForm} from "./users.forms";

import {TUser} from "./users.types";
import EErrorCode from "../../errors/codes";
import {UserProvider} from "./users.providers";
import AppResourceNotFoundError from "../../errors/resourceNotFound";
import {HttpMethod, IRouteHandlerParams, IRouteHandlerResponse} from "../../libs/app.types";


@Resource("/users")
@Service()
export class UserResources {

    constructor(private userProvider: UserProvider) {
    }


    @RouteHandler(HttpMethod.POST, "/")
    @RouteHandlerMiddlewares(FormValidationMiddleware(createUserForm),)
    public async registerUserHandler({body}: IRouteHandlerParams): Promise<IRouteHandlerResponse> {
        const {email, password} = body;
        const user = await this.userProvider.createUser(email, password);
        return {
            status: 201,
            content: {user}
        }
    }


    @RouteHandler(HttpMethod.GET, "/")
    @RouteHandlerMiddlewares(AuthMiddleware, RoleAuthorize(['admin']))
    public async getUsersHandler({user}: IRouteHandlerParams): Promise<IRouteHandlerResponse> {
        const allUsers = await this.userProvider.getUsers((<TUser>user).uid);
        return {content: {users: allUsers},}
    }


    @RouteHandler(HttpMethod.GET, "/me")
    @RouteHandlerMiddlewares(AuthMiddleware)
    public async getUserInfoHandler({user}: IRouteHandlerParams): Promise<IRouteHandlerResponse> {
        console.log(user);
        if (!user) throw new AppResourceNotFoundError(
            EErrorCode.RESOURCE_NOT_FOUND_ERROR, "User not found"
        );

        return {
            content: {user: user},
        }
    }

}