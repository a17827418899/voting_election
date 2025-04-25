const Controller = require('egg').Controller;

class AdminController extends Controller {
  // 选举列表
  async electionList() {
    const { ctx } = this;
    const { page, pageSize, keyword } = ctx.request.body;
    ctx.body = await ctx.service.election.list(page, pageSize, keyword);
  }
  
  // 新增选举
  async addElection() {
    const { ctx } = this;
    const { title, description, durationHours } = ctx.request.body;
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + durationHours * 60 * 60 * 1000);
    
    // 确保没有其他正在进行的选举
    const activeElection = await ctx.model.Election.findOne({ where: { title } });
    if (activeElection) {
      ctx.body = { success: true, message: '已有同名选举' };
      return;
    }
    
    const election = await ctx.model.Election.create({
      title,
      description,
      is_active: true,
      start_time: startTime,
      end_time: endTime
    });
    
    ctx.body = { success: true, election };
  }

  // 更新选举信息（只更新选举的标题和描述）
  async updateElection() {
    const { ctx } = this;
    const { id, title, description } = ctx.request.body;
    
    const sameNameElection = await ctx.model.Election.findOne({ where: { title } });
    if (sameNameElection) {
      ctx.body = { success: true, message: '已存在当前名称的选举' };
      return;
    }

    const activeElection = await ctx.model.Election.findOne({ where: { id } });
    if (!activeElection) {
      ctx.body = { success: true, message: '操作的选举不存在！' };
      return;
    }
    
    await ctx.model.Election.update(
      {
        title,
        description,
      },
      {
        where: { id }
      });
    
    ctx.body = { success: true, message: '更新成功！' };
  }
  
  // 开始选举
  async startElection() {
    const { ctx } = this;
    const { id, durationHours } = ctx.request.body;
    
    const startTime = new Date();
    const endTime = new Date(startTime.getTime() + durationHours * 60 * 60 * 1000);
    
    const election = await ctx.model.Election.findOne({ where: { id } }, ['is_active']);
    if (!election) {
      ctx.body = { success: false, message: '操作的选举不存在！' };
      return;
    }
    if (election.is_active) {
      ctx.body = { success: false, message: '当前选举已开始' };
      return;
    }
    await ctx.model.Election.update(
      {
        is_active: true,
        start_time: startTime,
        end_time: endTime
      },
      {
        where: { id }
      });
    
    ctx.body = { success: true, message: '开始选举成功' };
  }
  
  // 结束选举
  async endElection() {
    const { ctx } = this;
    const { id } = ctx.request.body;
    const election = await ctx.model.Election.findOne({ where: { id } }, ['is_active']);
    if (!election) {
      ctx.body = { success: false, message: '操作的选举不存在！' };
      return;
    }
    if (!election.is_active) {
      ctx.body = { success: false, message: '当前选举未开始' };
      return;
    }
    
    await ctx.model.Election.update(
      {
        is_active: false,
        end_time: new Date() // 立即结束
      },
      {
        where: { id }
      });
    
    ctx.body = { success: true, message: '结束选举成功' };
  }
  
  // 获取投票结果
  async getResults() {
    const { ctx } = this;
    const { electionId } = ctx.request.body;
    const result = await ctx.service.vote.getResults(electionId);
    ctx.body = { success: true, data: result };
  }
}

module.exports = AdminController;