import assert = require("assert");
import { defaultMetadataStorage } from "class-transformer/cjs/storage";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";
import ejs = require("ejs");
import fs = require("fs");
import mount = require("koa-mount");
import KoaRouter = require("koa-router");
import koaStatic = require("koa-static");
import { InfoObject } from "openapi3-ts/oas31";
import {
  getMetadataArgsStorage,
  RoutingControllersOptions,
} from "routing-controllers";
import { routingControllersToSpec } from "routing-controllers-openapi";
import swaggerUIDist = require("swagger-ui-dist");
// @ts-ignore
import pkg = require("../../package.json");

export interface RoutingControllersSwaggerOptions {
  routingControllersOptions: RoutingControllersOptions;
  mountPath?: string;
  enable?: boolean;
  additionalProperties?: InfoObject;
}

export default (options: RoutingControllersSwaggerOptions) => {
  const {
    routingControllersOptions,
    mountPath = "/swagger",
    enable = true,
    additionalProperties = {
      description: "swagger文档",
      title: "swagger文档",
      version: "0.0.1",
    },
  } = options;
  if (!enable) {
    return (_ctx, next) => {
      return next();
    };
  }
  assert(
    routingControllersOptions,
    `[${(pkg as any).name}] routingControllersOptions is required on config`
  );
  assert(mountPath, `[${(pkg as any).name}] mountPath is required on config`);

  const router = new KoaRouter();

  const template = fs
    .readFileSync(`${__dirname}/../view/swaggerIndex.ejs`)
    .toString();
  let swaggerIndexHtml;
  router.get("/index.html", (ctx) => {
    if (!swaggerIndexHtml) {
      swaggerIndexHtml = ejs.render(template, {
        swaggerJsonField: "./swagger.json",
      });
    }
    ctx.body = swaggerIndexHtml;
  });
  router.get("/", (ctx) => {
    ctx.body = `<script>location.href=location.href[location.href.length-1]==='/'?location.href+"index.html":location.href+'/index.html'</script>`;
  });

  const createSpec = () => {
    const schemas = validationMetadatasToSchemas({
      refPointerPrefix: "#/components/schemas/",
      classTransformerMetadataStorage: defaultMetadataStorage,
    });
    // Parse routing-controllers classes into OpenAPI spec:
    const storage = getMetadataArgsStorage();
    const spec = routingControllersToSpec(storage, routingControllersOptions, {
      components: { schemas: schemas as any },
      info: additionalProperties,
    });
    return spec;
  };
  let specCache: any;
  router.get("/swagger.json", (ctx) => {
    if (!specCache) {
      specCache = createSpec();
      const schemas =
        (specCache.components && specCache.components.schemas) || {};
      if (!schemas.Object) {
        schemas.Object = {
          type: "object",
        };
      }
      if (!schemas.Array) {
        schemas.Array = {
          type: "array",
          items: {},
        };
      }
    }
    ctx.body = specCache;
  });

  const pathToSwaggerUi = swaggerUIDist.absolutePath();
  router.get("/(.*)", mount(mountPath, koaStatic(pathToSwaggerUi)));
  if (mountPath) {
    const pRouter = new KoaRouter();
    pRouter.use(mountPath, router.routes());
    return pRouter.routes();
  }
  return router.routes();
};
