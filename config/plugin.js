'use strict';
// !插件进行配置 一般就是i引入包
/** @type Egg.EggPlugin */
module.exports = {
  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  mongoose: {
    enable: true,
    package: 'egg-mongoose',
  },
  routerGrouo: {
    enable: true,
    package: 'egg-router-group',
  },
  validate: {
    enable: true,
    package: 'egg-validate',
  },
};
