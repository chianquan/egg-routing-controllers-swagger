declare module 'egg' {

  import {RoutingControllersOptions} from 'routing-controllers';
  import {RoutingControllersSwaggerOptions} from './app/middleware/routing-controllers-swagger';

  export interface EggAppConfig {
    routingControllersSwagger: RoutingControllersSwaggerOptions;
  }
}
