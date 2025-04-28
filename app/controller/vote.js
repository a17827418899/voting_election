'use strict';

const Controller = require('egg').Controller;

/**
 * 投票相关
 */

class VoteController extends Controller {
  /**
   * @summary 提交投票
   * @router post /api/vote
   * @request query ingeter electionId 选举id
   * @request query array candidateIds 选中的候选人id数组
   * @property {Boolean} success - 是否成功
   * @property {String} message - 操作描述
   * 
   * {
   *   "success": true,
   *   "message": "投票成功"
   * }
   */
  async submitVote() {
    const { ctx } = this;
    const { electionId, candidateIds } = ctx.request.body;
    // 从上下文中获取用户ID
    const userId = ctx.session.user.id;
    // 检查选举是否正在进行
    const election = await ctx.model.Election.findOne({ where: { id: electionId } }, ['is_active', 'start_time', 'end_time']);
    if (!election || !election.is_active) {
      ctx.body = {
        success: false,
        message: '选择的选举不存在或选举未开始！',
      };
      ctx.status = 400;
      return;
    }

    const { start_time, end_time } = election;
    const isMoreThanCount = await ctx.service.vote.limitVoteCount(start_time, end_time);
    if (isMoreThanCount) {
      ctx.body = {
        success: false,
        message: '当前机器已投票超过10次，存在刷票嫌疑',
      };
      ctx.status = 400;
      return;
    }
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