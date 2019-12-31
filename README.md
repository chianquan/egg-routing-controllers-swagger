# egg-routing-controllers-swagger

Add swagger docs support for egg that use [routing-controllers](https://github.com/typestack/routing-controllers)(You can load routing-controllers by [@pagodas/egg-routing-controllers] or all by yourself).

## Install

```js
$ npm i @pagodas/egg-routing-controllers-swagger --save
```


For extensible,we also need install `routing-controllers@0.8.0` , `class-transformer@^0.2.3` , `class-validator@0.10.1` .

`routing-controllers@0.8.0` is our base peerDependencies.
`class-transformer^0.2.3` , `class-validator@0.10.1` is `routing-controllers@0.8.0`'s base peerDependencies.


```bash
$ npm i routing-controllers@0.8.0 class-transformer@^0.2.3 class-validator@0.10.1 --save
```


## Usage

```js
// {app_root}/config/plugin.js
exports.routingControllers = {
  enable: true,
  package: '@pagodas/egg-routing-controllers-swagger',
};
```

## Configuration

Support all configurations in [routing-controllers](https://github.com/typestack/routing-controllers).

```js
// {app_root}/config/config.default.js

  config.routingControllers = {
    routingControllersOptions,// required, config for routing-controllers created.
    mountPath : '/swagger', // optional defined which url path the doc html ui show mount.default:'/swagger'
    additionalProperties: { // optional, defined the doc html information.
        description: 'doc description',
        title: 'doc title',
        version: '2.0.0',
    },
    enable : true, // the switch for the middleware.Suggest set it false when run in production. default is true.
  };
```

## decorators

This package export all method from [class-validator-jsonschema](https://github.com/epiphone/class-validator-jsonschema) and [routing-controllers-openapi](https://github.com/epiphone/routing-controllers-openapi);
main decorator:
`@JSONSchema()` add description information for field.
`@OpenAPI()` add description information for your API.

Self declare `@ParamsWithOpenAPI()` and `@QueriesWithOpenAPI` wrap the `@Params` and `@QueryParams`,support param description.

## controller example

```js
// file app/routing-controller/util.ts

import {Ctx, Get, JsonController, Body} from 'routing-controllers';
import {IsOptional, IsString} from 'class-validator';
import {JSONSchema,OpenAPI} from '@pagodas/egg-routing-controllers-swagger';

class DataInput{
    @IsOptional()
    @IsString()
    @JSONSchema({description:'say hello to somebody.'})
    hello?:string
}

@JsonController()
export class UtilController {
  @Get('/api/search')
  async search(@Ctx()ctx: Context) {
    return {};
  }
  @OpenAPI({summary:'API for rendering data.'})
  @Post('/api/render')
  async render(@Body body:DataInput) {
    return {};
  }
}
```

## Questions & Suggestions

Please open an issue [here](https://github.com/chianquan/egg-routing-controllers-swagger/issues).

## License

[MIT](LICENSE)
