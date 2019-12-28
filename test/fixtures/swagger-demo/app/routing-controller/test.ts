import {IsDefined, IsString, registerDecorator, ValidationArguments, ValidationOptions} from 'class-validator';
import {JSONSchema} from 'class-validator-jsonschema';
import {Body, Get, JsonController, Params, Post, QueryParams} from 'routing-controllers';
import {OpenAPI} from 'routing-controllers-openapi';

// 扩展的class-validator的验证修饰器，可直接添加自定义校验方法
export function CustomValidate(
  validateFun: (value: any, args: ValidationArguments) => boolean | Promise<boolean>,
  validationOptions?: ValidationOptions,
) {
  return (object: object, propertyName: string) => {
    registerDecorator({
      name: 'customValidation',
      target: object.constructor,
      propertyName,
      async: false, // 如果改成异步，会导致validataSync忽略掉该验证
      constraints: [validateFun],
      options: validationOptions,
      validator: {
        validate: (value: any, args: ValidationArguments) => {
          return validateFun(value, args);
        },
        defaultMessage: () => {
          return '自定义校验的错误描述未填写';
        },
      },
    });
  };
}

class PostInput {
  @IsString()
  @JSONSchema({description: '我是字符串'})
  aa: string;

  @IsDefined()
  @CustomValidate((object) => {
    return !!object;
  }, {message: 'selector应为 筛选器objectId=>过滤条件的对象'})
  map: { aa: 'aa' };
}

class GetTestInfoParams {
  @IsString()
  @JSONSchema({description: '这是参数id'})
  id: string;
}

class GetTestInfoQueries {
  @JSONSchema({description: 'I am aa.'})
  @IsString()
  aa: string;
}

@JsonController('/test')
export class TestController {
  @OpenAPI({summary: '获取测试数据'})
  @Get('/info/:id')
  async getTestInfo(@Params(){id}: GetTestInfoParams, @QueryParams(){}: GetTestInfoQueries) {
    return {
      hello: 'world',
      id,
    };
  }

  @OpenAPI({summary: '发post请求'})
  @Post('/data')
  async postInfo(@Body() body: PostInput) {
    return body;
  }
}
