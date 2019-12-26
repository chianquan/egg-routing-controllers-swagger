import {Params, QueryParams} from 'routing-controllers';

import {defaultMetadataStorage} from 'class-transformer/storage';
import {
  getFromContainer,
  MetadataStorage,
  ValidationTypes,
} from 'class-validator';
import {validationMetadatasToSchemas} from 'class-validator-jsonschema';
import {ParameterObject} from 'openapi3-ts';
import {OpenAPI} from 'routing-controllers-openapi';

// 扩展routing-controllers Params 使能直接绑定params的描述等配置信息
export function ParamsWithOpenAPI() {
  return (object: object, methodName: string, index: number) => {
    Params()(object, methodName, index);
    // const tmp = Reflect.getMetadata('design:paramtypes', object, methodName);
    const type = Reflect.getMetadata('design:paramtypes', object, methodName)[index];
    // console.log(tmp, type);
    const targetName = type.name;
    OpenAPI((source) => {// todo 临时实现，后面确定下是否有官方支持的可能
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
    })(object, methodName);
  };
}

// 扩展routing-controllers Params 使能直接绑定params的描述等配置信息
export function QueriesWithOpenAPI() {
  return (object: object, methodName: string, index: number) => {
    QueryParams()(object, methodName, index);
    // const tmp = Reflect.getMetadata('design:paramtypes', object, methodName);
    const type = Reflect.getMetadata('design:paramtypes', object, methodName)[index];
    // console.log(tmp, type);
    const targetName = type.name;
    OpenAPI((source) => {// todo 临时实现，后面确定下是否有官方支持的可能
      const metadatas = (getFromContainer(MetadataStorage)as any).validationMetadatas.filter((validationMetadata) => {
        return validationMetadata.target.name === targetName;
      });

      const schemas = validationMetadatasToSchemas(metadatas, {
        refPointerPrefix: '#/components/schemas/',
        additionalConverters: {
          [ValidationTypes.IS_ENUM]: (meta) => ({
            enum: Object.values(meta.constraints[0]),
            type: 'string',
          }),
        },
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
    })(object, methodName);
  };
}
