'use strict';

const Service = require('egg').Service;
const { Op } = require('sequelize');

class ElectionService extends Service {
  /**
   * 获取选举列表（分页返回）
   * @param {Number} page - 页数，默认第一页
   * @param {Number} pageSize - 分页大小，默认每页10条数据
   * @param {String} keyword - 搜索关键词
   * @return Object
   */
  async list(page = 1, pageSize = 10, keyword = '') {
    const { ctx } = this;
    const where = {};

    // 搜索条件
    if (keyword) {
      where[Op.or] = [
        { title: { [Op.like]: `%${keyword}%` } },
        { description: { [Op.like]: `%${keyword}%` } }
      ];
    }

    // 分页查询
    const { count, rows } = await ctx.model.Election.findAndCountAll({
      where,
      offset: (page - 1) * pageSize,
      limit: parseInt(pageSize),
      order: [['created_at', 'DESC']]
    }, ['id', 'title', 'description', 'is_active', 'start_time', 'end_time']);

    return {
      total: count,
      list: rows,
      currentPage: parseInt(page),
      totalPages: Math.ceil(count / pageSize)
    };
  }
}

module.exports = ElectionService;