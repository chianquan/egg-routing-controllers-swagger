import {Params, QueryParams} from 'routing-controllers';

import {defaultMetadataStorage} from 'class-transformer/storage';
import {
  getFromContainer,
  MetadataStorage,
} from 'class-validator';
import {validationMetadatasToSchemas} from 'class-validator-jsonschema';
import _ = require('lodash');  // todo remove
import {ParameterObject} from 'openapi3-ts';
import {RoutingControllersSwaggerOptions} from './app/middleware/routing-controllers-swagger';

export * from 'class-validator-jsonschema';
export * from 'routing-controllers-openapi';

import classValidatorJsonSchema = require('class-validator-jsonschema');
import routingControllersOpenapi = require('routing-controllers-openapi');

// declare all the dependence decorator,so that IDE can recognize and use the auto import feature.
export const JSONSchema = classValidatorJsonSchema.JSONSchema;
export const OpenAPI = routingControllersOpenapi.OpenAPI;
export const ResponseSchema = routingControllersOpenapi.ResponseSchema;
export const applyOpenAPIDecorator = routingControllersOpenapi.applyOpenAPIDecorator;
export type OpenAPIParam = routingControllersOpenapi.OpenAPIParam;

// extends routing-controllers Params ,make description for params take effect.
export function ParamsWithOpenAPI() {
  return (object: object, methodName: string, index: number) => {
    Params()(object, methodName, index);
    const type = Reflect.getMetadata('design:paramtypes', object, methodName)[index];
    const targetName = type.name;
    OpenAPI((source) => {// todo tmp
      const metadatas = (getFromContainer(MetadataStorage)as any).validationMetadatas.filter((validationMetadata) => {
        return validationMetadata.target.name === targetName;
      });

      const schemas = validationMetadatasToSchemas(metadatas, {
        refPointerPrefix: '#/components/schemas/',
        classTransformerMetadataStorage: defaultMetadataStorage,
      });
      const schema = schemas[targetName];
      if (!schema) {
        return source;
      }
      source.parameters = _.chain(schema.properties)
        .toPairs()
        .map(([name, propertyInfo]) => ({
          in: 'path',
          name,
          required: true,
          schema: {
            type: 'string',
          },
          description: propertyInfo.description || '',
        } as ParameterObject))
        .concat(source.parameters as ParameterObject[])
        .reject(({description}) => description === undefined)
        .value();
      return source;
    })(object, methodName, {} as PropertyDescriptor);
  };
}

// extends routing-controllers QueryParams ,make description for QueryParams take effect.
export function QueriesWithOpenAPI() {
  return (object: object, methodName: string, index: number) => {
    QueryParams()(object, methodName, index);
    // const tmp = Reflect.getMetadata('design:paramtypes', object, methodName);
    const type = Reflect.getMetadata('design:paramtypes', object, methodName)[index];
    // console.log(tmp, type);
    const targetName = type.name;
    OpenAPI((source) => {
      const metadatas = (getFromContainer(MetadataStorage)as any).validationMetadatas.filter((validationMetadata) => {
        return validationMetadata.target.name === targetName;
      });

      const schemas = validationMetadatasToSchemas(metadatas, {
        refPointerPrefix: '#/components/schemas/',
        classTransformerMetadataStorage: defaultMetadataStorage,
      });
      const schema = schemas[targetName];
      if (!schema) {
        return source;
      }
      source.parameters = _.chain(schema.properties)
        .toPairs()
        .map(([name, propertyInfo]) => ({
          in: 'query',
          name,
          required: false,
          schema: {
            type: propertyInfo.type,
          },
          description: propertyInfo.description || '',
        } as ParameterObject))
        .concat(source.parameters as ParameterObject[])
        .reject(({description}) => description === undefined)
        .value();
      return source;
    })(object, methodName, {} as PropertyDescriptor);
  };
}

// @ts-ignore
declare module 'egg' {
  export interface EggAppConfig {
    routingControllersSwagger: RoutingControllersSwaggerOptions;
  }
}
