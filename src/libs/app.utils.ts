import 'reflect-metadata';
import {HttpMethod, IRouteDefinition} from "./app.types";


/**
 *
 * @param method
 * @param path
 * @constructor
 */
export function RouteHandler(method: HttpMethod, path: string): MethodDecorator {
    return (target, propertyKey, descriptor): void => {
        if (!Reflect.hasMetadata('routes', target.constructor)) {
            Reflect.defineMetadata('routes', [], target.constructor);
        }

        const routes = Reflect.getMetadata('routes', target.constructor) as Array<IRouteDefinition>;
        routes.push({path: path, method, methodName: <string>propertyKey});
        Reflect.defineMetadata('routes', routes, target.constructor);
    }
}


/**
 *
 * @constructor
 * @param middlewares
 */
export function RouteHandlerMiddlewares(...middlewares: Function[]): MethodDecorator {
    return (target, propertyKey, descriptor): void => {
        // update the list of middlewares
        Reflect.defineMetadata(
            propertyKey, {
                ...(Reflect.getMetadata(propertyKey, target)),
                middlewares: middlewares
            }, target,
        );
    }
}