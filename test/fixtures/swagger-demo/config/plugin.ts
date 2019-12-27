import {EggPlugin} from 'egg';

const plugin: EggPlugin = {
  session: {
    enable: false,
  },
  i18n: {
    enable: false,
  },
  routingControllers: {
    enable: true,
    package: '@pagodas/egg-routing-controllers',
  },
};

export default plugin;
