'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const user = app.model.define('user', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true, comment: '主键，用户id' },
    email: { type: STRING(30), default: Date.now(), comment: '用户邮箱' },
    password: { type: STRING(50), default: Date.now(), comment: '用户密码，已加密' },
    is_verified: { type: INTEGER, default: Date.now(), comment: '邮箱是否已验证' },
    is_admin: { type: INTEGER, default: Date.now(), comment: '是否为管理员' },
    verification_code: { type: STRING(255), default: Date.now(), comment: '当前验证码'  },
    createdAt: { type: DATE, default: Date.now(), comment: '创建时间' },
    updatedAt: { type: DATE, default: Date.now(), comment: '修改时间' },
  }, {
    freezeTableName: true,  // 禁止自动复数化
    tableName: 'user'    // 直接指定表名
  });

  return user;
};