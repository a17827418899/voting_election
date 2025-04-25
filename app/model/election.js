'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, BOOLEAN } = app.Sequelize;

  const elections = app.model.define('elections', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: STRING(255) },
    description: { type: STRING(500) },
    is_active: { type: BOOLEAN, Comment: '是否正在选举' },
    start_time: { type: DATE },
    end_time: { type: DATE },
    createdAt: { type: DATE, default: Date.now() },
    updatedAt: { type: DATE, default: Date.now() },
  }, {
    freezeTableName: true,  // 禁止自动复数化
    tableName: 'elections'    // 直接指定表名
  });

  return elections;
};