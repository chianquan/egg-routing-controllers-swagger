'use strict';

exports.keys = 'foo';

const routingControllersOptions = {
  defaultErrorHandler: false,
  validation: {
    forbidNonWhitelisted: true, // 当存在whitelist之外的属性时抛错
    forbidUnknownValues: true, // 禁止使用没有定义校验属性的对象做校验
    whitelist: true, // 只允许带修饰器的属性透传~
  },
};
exports.routingControllers = {
  options: routingControllersOptions,
  disableResponseTransform: true,
};
exports.routingControllersSwagger = {
  routingControllersOptions,
};
