import {IsString} from 'class-validator';
import {JSONSchema} from 'class-validator-jsonschema';
import {Body, JsonController} from 'routing-controllers';
import {OpenAPI} from 'routing-controllers-openapi';

class PostInput {
  @IsString()
  @JSONSchema({description: '我是字符串'})
  aa: string;
}

@JsonController('/test')
export class TestController {
  @OpenAPI({summary: '获取测试数据'})
  async getTestInfo() {
    return {
      hello: 'world',
    };
  }

  @OpenAPI({summary: '发post请求'})
  async postInfo(@Body() body: PostInput) {
    return body;
  }
}
