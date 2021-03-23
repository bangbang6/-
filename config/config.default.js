/* eslint valid-jsdoc: "off" */

'use strict';
const path = require('path');
// 默认配置
/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1610506265669_3937';
  config.multipart = {
    mode: 'file',
    whitelist: () => true,

  };
  config.UPLOAD_DIR = path.resolve(__dirname, '..', 'app/public');
  // add your middleware config here
  config.middleware = [];

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
    security: {
      csrf: { enable: false },
    },
    // 配置egg链接到Mongo
    mongoose: {
      client: {
        url: 'mongodb://127.0.0.1:27017/kkbfile', // 默认端口+数据库  需要先启动本地Mongo才能链接到
        options: {},
      },
    },
    password: {
      secret: 'bang',
    },
    jwt: {
      secret: 'bangbang66', // 会被合并到appconfig里面去
    },
  };
};
