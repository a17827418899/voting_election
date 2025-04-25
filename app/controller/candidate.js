const Controller = require('egg').Controller;

class AdminController extends Controller {
  // 候选人
  async list() {
    const { ctx } = this;
    const { page, pageSize, keyword } = ctx.request.body;
    ctx.body = await ctx.service.candidate.list(page, pageSize, keyword);
  }
  
  // 新曾候选人
  async create() {
    const { ctx } = this;
    const { name, description } = ctx.request.body;
    ctx.body = await ctx.service.candidate.create(name, description);
  }

  // 修改候选人信息
  async update() {
    const { ctx } = this;
    const { id } = ctx.params;
    const { name, description } = ctx.request.body;
    ctx.body = await ctx.service.candidate.update(id, { name, description });
  }
  
  // 删除候选人
  async destroy() {
    const { ctx } = this;
    const { id } = ctx.params;
    ctx.body = await ctx.service.candidate.delete(id);
  }
}

module.exports = AdminController;