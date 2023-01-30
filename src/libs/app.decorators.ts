import 'reflect-metadata';
import {Container} from "typedi";

import {appRouter} from "./app.server";
import appErrorhandler from "./app.errorhandler";

import AppBaseError from "../errors/base";
import {NextFunction, Request, Response} from "express";
import {IRouteDefinition, IRouteHandlerParams, IRouteHandlerResponse} from "./app.types";


/**
 *
 * @param prefix
 * @constructor
 */
export function Resource(prefix: string): ClassDecorator {
    return (target: any) => {
        Reflect.defineMetadata('prefix', prefix, target);
        if (!Reflect.hasMetadata('routes', target)) {
            Reflect.defineMetadata('routes', [], target);
        }

        const instance: any = Container.get(target);
        const routes: Array<IRouteDefinition> = Reflect.getMetadata('routes', target);

        routes.forEach((route: IRouteDefinition) => {
            // console.log(route);
            // console.log(Reflect.getMetadataKeys(instance));
            console.debug(`>👍🏾Registered route [${route.method}] ${prefix}${route.path}`);

            const routeHandlerMetadata = Reflect.getMetadata(route.methodName, instance);
            const middlewares = routeHandlerMetadata?.middlewares || [];

            appRouter[route.method](`${prefix}${route.path}`, async (request: Request, response: Response, next: NextFunction) => {
                try {
                    // execute middlewares first
                    for (const middleware of middlewares)
                        await middleware(request, response);

                    // execute the controller now
                    const controllerHandler = instance[route.methodName].bind(instance);
                    const {params, query, body} = request;
                    const user = Object.getOwnPropertyDescriptor(request, 'user')?.value;

                    const routeHandlerParams: IRouteHandlerParams = {params, query, body, user};
                    const {content, status}: IRouteHandlerResponse = await controllerHandler(routeHandlerParams);
                    response.status(status || 200).json(content);

                } catch (e) {
                    await appErrorhandler(<AppBaseError | Error>e, request, response, next);
                }
            })
        })
    }
}