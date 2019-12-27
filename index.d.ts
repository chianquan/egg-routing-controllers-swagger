import { RoutingControllersSwaggerOptions } from './app/middleware/routing-controllers-swagger';
export declare function ParamsWithOpenAPI(): (object: object, methodName: string, index: number) => void;
export declare function QueriesWithOpenAPI(): (object: object, methodName: string, index: number) => void;
declare module 'egg' {
    interface EggAppConfig {
        routingControllersSwagger: RoutingControllersSwaggerOptions;
    }
}
