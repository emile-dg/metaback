import {Service} from "typedi";
import {LoginRouteHandler} from "../../middlewares/authentication";
import {Resource} from "../../libs/app.decorators";
import {HttpMethod, IRouteHandlerParams, IRouteHandlerResponse} from "../../libs/app.types";
import {RouteHandler, RouteHandlerMiddlewares} from "../../libs/app.utils";


@Resource("/auth")
@Service()
export class AuthResources {

    constructor() {
    }

    @RouteHandler(HttpMethod.POST, "/login")
    @RouteHandlerMiddlewares(LoginRouteHandler)
    public async login({user}: IRouteHandlerParams): Promise<IRouteHandlerResponse> {
        return {
            content: {user}
        }
    }
}