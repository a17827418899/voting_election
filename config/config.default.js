/* eslint valid-jsdoc: "off" */

'use strict';

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
  config.keys = appInfo.name + '_1557201798621_3561';

  // add your middleware config here
  config.middleware = [];
  config.security = {
    xframe: {
      enable: false,
    },
    csrf: {
      enable: false,
      // headerName: 'x-csrf-token', // 通过 header 传递 CSRF token 的默认字段为 x-csrf-token
    }
  }
  config.cluster = {
    listen: {
      path: '',
      port: 8090,
      hostname: '127.0.0.1', // 重要：允许外部访问
    },
  };
  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    sequelize: {
      dialect: 'mysql',
      // host
      host: '127.0.0.1',
      // 端口号
      port: '3306',
      // 用户名
      user: 'root',
      // 密码
      password: '123456',
      // 数据库名
      database: 'voting_election',
    },

  // Redis配置
  redis: {
    client: {
      port: 6379,
      host: '127.0.0.1',
      password: '123456',
      db: 0
    }
  },

  // JWT配置
  jwt: {
    secret: 'your_jwt_secret_key',
    expiresIn: '24h'
  },

  email: {
    host: 'smtp.qq.com', // qq邮箱指定host
    port: 465, // qq邮箱指定port
    secure: true,
    auth: {
      user: '2192559956@qq.com',
      pass: 'jpzlukyoahqmdjhd' // 需要根据自己的邮箱进行填写
    }
  },
  };

  return {
    ...config,
    ...userConfig,
  };
};