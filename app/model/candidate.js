'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const candidates = app.model.define('candidates', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: STRING(30) },
    description: { type: STRING(500) },
    createdAt: { type: DATE, default: Date.now() },
    updatedAt: { type: DATE, default: Date.now() },
  }, {
    freezeTableName: true,  // 禁止自动复数化
    tableName: 'candidates'    // 直接指定表名
  });

  return candidates;
};