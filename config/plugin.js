'use strict';

/** @type Egg.EggPlugin */
module.exports = {

  sequelize: {
    enable: true,
    package: 'egg-sequelize',
  },
  jwt: {
    enable: true,
    package: 'egg-jwt',
  }
};
