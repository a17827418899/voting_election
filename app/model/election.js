'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, BOOLEAN } = app.Sequelize;

  const elections = app.model.define('elections', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true, comment: '主键，选举id' },
    title: { type: STRING(255), comment: '选举标题' },
    description: { type: STRING(500), comment: '选举描述' },
    is_active: { type: BOOLEAN, comment: '是否正在选举' },
    start_time: { type: DATE, comment: '选举开始时间' },
    end_time: { type: DATE, comment: '选举结束时间' },
    createdAt: { type: DATE, default: Date.now(), comment: '创建时间' },
    updatedAt: { type: DATE, default: Date.now(), comment: '修改时间' },
  }, {
    freezeTableName: true,  // 禁止自动复数化
    tableName: 'elections'    // 直接指定表名
  });

  return elections;
};