'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const user = app.model.define('user', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: STRING(30), default: Date.now() },
    password: { type: STRING(50), default: Date.now() },
    is_verified: { type: INTEGER, default: Date.now() },
    is_admin: { type: INTEGER, default: Date.now() },
    verification_code: { type: STRING(255), default: Date.now() },
    createdAt: { type: DATE, default: Date.now() },
    updatedAt: { type: DATE, default: Date.now() },
  }, {
    freezeTableName: true,  // 禁止自动复数化
    tableName: 'user'    // 直接指定表名
  });

  return user;
};