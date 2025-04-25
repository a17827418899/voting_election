'use strict';

const Controller = require('egg').Controller;

class VoteController extends Controller {
  // 提交投票
  async submitVote() {
    const { ctx } = this;
    const { electionId, candidateIds } = ctx.request.body;
    // 从上下文中获取用户ID
    const userId = ctx.session.user.id; 

    // 验证输入
    if (!candidateIds || !Array.isArray(candidateIds) || candidateIds.length === 0) {
      ctx.body = {
        success: false,
        message: '请选择至少一位候选人',
      };
      ctx.status = 400;
      return;
    }

    try {
      const result = await ctx.service.vote.submitVote(electionId, userId, candidateIds);
      if (result) {
        ctx.body = {
          success: true,
          message: '投票成功',
        };
      } else {
        ctx.body = {
          success: false,
          message: '投票失败',
        };
        ctx.status = 400;
      }
    } catch (error) {
      ctx.logger.error('投票失败:', error);
      ctx.body = {
        success: false,
        message: error.message || '投票失败',
      };
      ctx.status = error.status || 500;
    }
  }
}

module.exports = VoteController;