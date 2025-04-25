'use strict';

module.exports = app => {
  const { INTEGER, DATE } = app.Sequelize;

  const vote = app.model.define('vote', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: INTEGER },
    candidate_id: { type: INTEGER },
    election_id: { type: INTEGER },
    voted_at: { type: INTEGER, default: Date.now() },
    createdAt: { type: DATE, default: Date.now() },
    updatedAt: { type: DATE, default: Date.now() },
  }, {
    freezeTableName: true,  // 禁止自动复数化
    tableName: 'vote'    // 直接指定表名
  });

  return vote;
};