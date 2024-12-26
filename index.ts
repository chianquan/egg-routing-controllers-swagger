import { RoutingControllersSwaggerOptions } from "./app/middleware/routing-controllers-swagger";

export * from "class-validator-jsonschema";
export * from "routing-controllers-openapi";

import classValidatorJsonSchema = require("class-validator-jsonschema");
import routingControllersOpenapi = require("routing-controllers-openapi");

// declare all the dependence decorator,so that IDE can recognize and use the auto import feature.
export const JSONSchema = classValidatorJsonSchema.JSONSchema;
export const OpenAPI = routingControllersOpenapi.OpenAPI;
export const ResponseSchema = routingControllersOpenapi.ResponseSchema;
export const applyOpenAPIDecorator =
  routingControllersOpenapi.applyOpenAPIDecorator;
export type OpenAPIParam = routingControllersOpenapi.OpenAPIParam;

// @ts-ignore
declare module "egg" {
  export interface EggAppConfig {
    routingControllersSwagger: RoutingControllersSwaggerOptions;
  }
}
