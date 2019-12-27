/// <reference types="koa" />
/// <reference types="koa-compose" />
import KoaRouter = require('koa-router');
import { InfoObject } from 'openapi3-ts';
import { RoutingControllersOptions } from 'routing-controllers';
export interface RoutingControllersSwaggerOptions {
    routingControllersOptions: RoutingControllersOptions;
    mountPath?: string;
    enable?: boolean;
    additionalProperties: InfoObject;
}
declare const _default: (options: RoutingControllersSwaggerOptions) => import("koa-compose").Middleware<import("koa").ParameterizedContext<any, KoaRouter.IRouterParamContext<any, {}>>>;
export default _default;
