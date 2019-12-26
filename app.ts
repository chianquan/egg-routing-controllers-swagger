module.exports = (app) => {
  const {config} = app;
  config.appMiddleware.push('routingControllersSwagger');
};
