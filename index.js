"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const routing_controllers_1 = require("routing-controllers");
const storage_1 = require("class-transformer/storage");
const class_validator_1 = require("class-validator");
const class_validator_jsonschema_1 = require("class-validator-jsonschema");
const _ = require("lodash"); // todo remove
const routing_controllers_openapi_1 = require("routing-controllers-openapi");
// 扩展routing-controllers Params 使能直接绑定params的描述等配置信息
function ParamsWithOpenAPI() {
    return (object, methodName, index) => {
        routing_controllers_1.Params()(object, methodName, index);
        const type = Reflect.getMetadata('design:paramtypes', object, methodName)[index];
        const targetName = type.name;
        routing_controllers_openapi_1.OpenAPI((source) => {
            const metadatas = class_validator_1.getFromContainer(class_validator_1.MetadataStorage).validationMetadatas.filter((validationMetadata) => {
                return validationMetadata.target.name === targetName;
            });
            const schemas = class_validator_jsonschema_1.validationMetadatasToSchemas(metadatas, {
                refPointerPrefix: '#/components/schemas/',
                classTransformerMetadataStorage: storage_1.defaultMetadataStorage,
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
            }))
                .concat(source.parameters)
                .reject(({ description }) => description === undefined)
                .value();
            return source;
        })(object, methodName, {}); // todo
    };
}
exports.ParamsWithOpenAPI = ParamsWithOpenAPI;
// 扩展routing-controllers Params 使能直接绑定params的描述等配置信息
function QueriesWithOpenAPI() {
    return (object, methodName, index) => {
        routing_controllers_1.QueryParams()(object, methodName, index);
        // const tmp = Reflect.getMetadata('design:paramtypes', object, methodName);
        const type = Reflect.getMetadata('design:paramtypes', object, methodName)[index];
        // console.log(tmp, type);
        const targetName = type.name;
        routing_controllers_openapi_1.OpenAPI((source) => {
            const metadatas = class_validator_1.getFromContainer(class_validator_1.MetadataStorage).validationMetadatas.filter((validationMetadata) => {
                return validationMetadata.target.name === targetName;
            });
            const schemas = class_validator_jsonschema_1.validationMetadatasToSchemas(metadatas, {
                refPointerPrefix: '#/components/schemas/',
                classTransformerMetadataStorage: storage_1.defaultMetadataStorage,
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
            }))
                .concat(source.parameters)
                .reject(({ description }) => description === undefined)
                .value();
            return source;
        })(object, methodName, {});
    };
}
exports.QueriesWithOpenAPI = QueriesWithOpenAPI;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZEQUF3RDtBQUV4RCx1REFBaUU7QUFDakUscURBR3lCO0FBQ3pCLDJFQUF3RTtBQUN4RSw0QkFBNkIsQ0FBRSxjQUFjO0FBRTdDLDZFQUFvRDtBQUdwRCxvREFBb0Q7QUFDcEQsU0FBZ0IsaUJBQWlCO0lBQy9CLE9BQU8sQ0FBQyxNQUFjLEVBQUUsVUFBa0IsRUFBRSxLQUFhLEVBQUUsRUFBRTtRQUMzRCw0QkFBTSxFQUFFLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUNwQyxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsV0FBVyxDQUFDLG1CQUFtQixFQUFFLE1BQU0sRUFBRSxVQUFVLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNqRixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQzdCLHFDQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUNqQixNQUFNLFNBQVMsR0FBSSxrQ0FBZ0IsQ0FBQyxpQ0FBZSxDQUFRLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLENBQUMsa0JBQWtCLEVBQUUsRUFBRTtnQkFDNUcsT0FBTyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLFVBQVUsQ0FBQztZQUN2RCxDQUFDLENBQUMsQ0FBQztZQUVILE1BQU0sT0FBTyxHQUFHLHlEQUE0QixDQUFDLFNBQVMsRUFBRTtnQkFDdEQsZ0JBQWdCLEVBQUUsdUJBQXVCO2dCQUN6QywrQkFBK0IsRUFBRSxnQ0FBc0I7YUFDeEQsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ25DLElBQUksQ0FBQyxNQUFNLEVBQUU7Z0JBQ1gsT0FBTyxNQUFNLENBQUM7YUFDZjtZQUNELE1BQU0sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDO2lCQUMzQyxPQUFPLEVBQUU7aUJBQ1QsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQzlCLEVBQUUsRUFBRSxNQUFNO2dCQUNWLElBQUk7Z0JBQ0osUUFBUSxFQUFFLElBQUk7Z0JBQ2QsTUFBTSxFQUFFO29CQUNOLElBQUksRUFBRSxRQUFRO2lCQUNmO2dCQUNELFdBQVcsRUFBRSxZQUFZLENBQUMsV0FBVyxJQUFJLEVBQUU7YUFDeEIsQ0FBQSxDQUFDO2lCQUNyQixNQUFNLENBQUMsTUFBTSxDQUFDLFVBQStCLENBQUM7aUJBQzlDLE1BQU0sQ0FBQyxDQUFDLEVBQUMsV0FBVyxFQUFDLEVBQUUsRUFBRSxDQUFDLFdBQVcsS0FBSyxTQUFTLENBQUM7aUJBQ3BELEtBQUssRUFBRSxDQUFDO1lBQ1gsT0FBTyxNQUFNLENBQUM7UUFDaEIsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLFVBQVUsRUFBRSxFQUF3QixDQUFDLENBQUMsQ0FBQyxPQUFPO0lBQzNELENBQUMsQ0FBQztBQUNKLENBQUM7QUFuQ0QsOENBbUNDO0FBRUQsb0RBQW9EO0FBQ3BELFNBQWdCLGtCQUFrQjtJQUNoQyxPQUFPLENBQUMsTUFBYyxFQUFFLFVBQWtCLEVBQUUsS0FBYSxFQUFFLEVBQUU7UUFDM0QsaUNBQVcsRUFBRSxDQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDekMsNEVBQTRFO1FBQzVFLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsbUJBQW1CLEVBQUUsTUFBTSxFQUFFLFVBQVUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ2pGLDBCQUEwQjtRQUMxQixNQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO1FBQzdCLHFDQUFPLENBQUMsQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUNqQixNQUFNLFNBQVMsR0FBSSxrQ0FBZ0IsQ0FBQyxpQ0FBZSxDQUFRLENBQUMsbUJBQW1CLENBQUMsTUFBTSxDQUFDLENBQUMsa0JBQWtCLEVBQUUsRUFBRTtnQkFDNUcsT0FBTyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsSUFBSSxLQUFLLFVBQVUsQ0FBQztZQUN2RCxDQUFDLENBQUMsQ0FBQztZQUVILE1BQU0sT0FBTyxHQUFHLHlEQUE0QixDQUFDLFNBQVMsRUFBRTtnQkFDdEQsZ0JBQWdCLEVBQUUsdUJBQXVCO2dCQUN6QywrQkFBK0IsRUFBRSxnQ0FBc0I7YUFDeEQsQ0FBQyxDQUFDO1lBQ0gsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ25DLElBQUksQ0FBQyxNQUFNLEVBQUU7Z0JBQ1gsT0FBTyxNQUFNLENBQUM7YUFDZjtZQUNELE1BQU0sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDO2lCQUMzQyxPQUFPLEVBQUU7aUJBQ1QsR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsWUFBWSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQzlCLEVBQUUsRUFBRSxPQUFPO2dCQUNYLElBQUk7Z0JBQ0osUUFBUSxFQUFFLEtBQUs7Z0JBQ2YsTUFBTSxFQUFFO29CQUNOLElBQUksRUFBRSxZQUFZLENBQUMsSUFBSTtpQkFDeEI7Z0JBQ0QsV0FBVyxFQUFFLFlBQVksQ0FBQyxXQUFXLElBQUksRUFBRTthQUN4QixDQUFBLENBQUM7aUJBQ3JCLE1BQU0sQ0FBQyxNQUFNLENBQUMsVUFBK0IsQ0FBQztpQkFDOUMsTUFBTSxDQUFDLENBQUMsRUFBQyxXQUFXLEVBQUMsRUFBRSxFQUFFLENBQUMsV0FBVyxLQUFLLFNBQVMsQ0FBQztpQkFDcEQsS0FBSyxFQUFFLENBQUM7WUFDWCxPQUFPLE1BQU0sQ0FBQztRQUNoQixDQUFDLENBQUMsQ0FBQyxNQUFNLEVBQUUsVUFBVSxFQUFFLEVBQXdCLENBQUMsQ0FBQztJQUNuRCxDQUFDLENBQUM7QUFDSixDQUFDO0FBckNELGdEQXFDQyJ9