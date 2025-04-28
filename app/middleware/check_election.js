/**
 * 检查所选选举，是否存在或是否已开始
 */
'use strict';

module.exports = () => {
  return async function checkElection(ctx, next) {
    const { electionId } = ctx.request.body;
    const currentElection = await ctx.model.Election.findOne({ where: {id: electionId } }, ['is_active']);
    if (!currentElection) {
      ctx.body = { success: false, message: '请选中正确的选举' };
      return;
    }
    if (currentElection.is_active) {
      ctx.body = { success: false, message: '当前选举已开始，不可对候选人做相关操作' };
      return;
    }
    await next();
  };
};