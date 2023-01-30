import {TUser} from "../apps/users/users.types";

export type IRouteHandlerParams = {
    readonly user?: TUser,
    readonly body?: any,
    readonly query?: any,
    readonly params?: any,
}

export enum HttpMethod {
    GET = 'get',
    PUT = 'put',
    POST = 'post',
    PATCH = 'patch',
    DELETE = 'delete',
}

export type IRouteHandlerResponse = {
    readonly content?: any,
    readonly status?: number,
}

export type IRouteDefinition = {
    path: string,
    methodName: string,
    method: HttpMethod,
}