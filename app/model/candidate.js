'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const candidates = app.model.define('candidates', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true, comment: '主键，候选人id' },
    election_id: { type: INTEGER, comment: '选举id' },
    name: { type: STRING(30), comment: '候选人名称' },
    description: { type: STRING(500), comment: '候选人描述' },
    createdAt: { type: DATE, default: Date.now(), comment: '创建时间' },
    updatedAt: { type: DATE, default: Date.now(), comment: '修改时间' },
  }, {
    freezeTableName: true,  // 禁止自动复数化
    tableName: 'candidates'    // 直接指定表名
  });

  return candidates;
};