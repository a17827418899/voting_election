'use strict';

const Service = require('egg').Service;
const { Op } = require('sequelize');

class CandidateService extends Service {
  // 获取候选人列表（分页返回）
  async list(page = 1, pageSize = 10, keyword = '') {
    const { ctx } = this;
    const where = {};

    // 搜索条件
    if (keyword) {
      where[Op.or] = [
        { name: { [Op.like]: `%${keyword}%` } },
        { description: { [Op.like]: `%${keyword}%` } }
      ];
    }

    // 分页查询
    const { count, rows } = await ctx.model.Candidate.findAndCountAll({
      where,
      offset: (page - 1) * pageSize,
      limit: parseInt(pageSize),
      order: [['created_at', 'DESC']]
    });

    return {
      total: count,
      list: rows,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / pageSize)
    };
  }

  // 创建候选人
  async create(name, description) {
    const { ctx } = this; 
    // 验证输入
    if (!name || name.length > 50) {
      ctx.throw(400, '候选人姓名不能为空且不超过50字');
    }

    // 防止重复创建
    const exist = await ctx.model.Candidate.findOne({ where: { name } });
    if (exist) {
      ctx.throw(409, '候选人已存在');
    }

    return await ctx.model.Candidate.create({
      name,
      description,
    });
  }

  // 更新候选人信息
  async update(id, { name, description }) {
    const { ctx } = this;
    const candidate = await this.getById(id);

    // 验证名称冲突（排除自己）
    if (name && name !== candidate.name) {
      const exist = await ctx.model.Candidate.findOne({
        where: { name, id: { [Op.ne]: id } }
      });
      if (exist) ctx.throw(409, '候选人名称已存在');
    }

    return await candidate.update({
      name: name || candidate.name,
      description: description ?? candidate.description,
    });
  }

  // 删除候选人（软删除）
  async delete(id) {
    const { ctx } = this;
    const candidate = await this.getById(id);
    
    // 检查是否有关联投票
    const hasVotes = await ctx.model.Vote.count({
      where: { candidate_id: id }
    });
    
    if (hasVotes > 0) {
      ctx.throw(400, '该候选人已有投票记录，不可删除');
    }

    await candidate.destroy();
    return {
        success: true,
        message: '删除成功',
      };
  }

  // 获取候选人详情
  async getById(id) {
    const { ctx } = this;
    const candidate = await ctx.model.Candidate.findByPk(id);
    if (!candidate) {
      ctx.throw(404, '候选人不存在');
    }
    return candidate;
  }
}

module.exports = CandidateService;