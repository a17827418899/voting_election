const Controller = require('egg').Controller;

/**
 * 管理员选举控制相关
 */

class AdminController extends Controller {
  /**
   * @summary 选举列表
   * @router get /api/admin/election/list
   * @request body integer page 页码，默认1
   * @request body integer pageSize 每页数量，默认10
   * @request body string keyword 搜索关键词(可选)
   * @property {Number} total - 选举总数
   * @property {Array} list - 选举列表数据
   * @property {Number} list.id - 选举id
   * @property {String} list.title - 选举标题
   * @property {String} list.description - 选举描述
   * @property {Boolean} list.is_active - 选举是否开始
   * @property {Date} list.start_time - 选举开始时间
   * @property {Date} list.end_time - 选举结束时间
   * @property {Date} list.createdAt - 创建时间
   * @property {Date} list.updatedAt - 修改时间
   * @property {Number} currentPage - 当前页数
   * @property {Number} totalPages - 总页数
   * 
   * {
   *   "total": 4,
   *   "list": [
   *       {
   *           "id": 4,
   *           "title": "优秀程序员444",
   *           "description": "选一位优选的程序员444",
   *           "is_active": true,
   *           "start_time": "2025-04-25T12:12:32.000Z",
   *           "end_time": "2025-04-26T08:12:32.000Z",
   *           "createdAt": "2025-04-25T12:12:32.000Z",
   *           "updatedAt": "2025-04-25T12:12:32.000Z"
   *       }
   *   ],
   *   "currentPage": 1,
   *   "totalPages": 1
   * }
   */
  async electionList() {
    const { ctx } = this;
    const { page, pageSize, keyword } = ctx.request.body;
    ctx.body = await ctx.service.election.list(page, pageSize, keyword);
  }
  
  /**
   * @summary 新增选举
   * @router post /api/admin/election/add
   * @request body string title 选举标题
   * @request body string description 选举描述
   * @request body integer durationHours 选举持续时间，单位：小时
   * @property {Boolean} success - 是否成功
   * @property {Object} election - 选举对象
   * @property {Number} election.id - 选举id
   * @property {String} election.title - 选举标题
   * @property {String} election.description - 选举描述
   * @property {Boolean} election.is_active - 选举是否开始
   * @property {Date} election.start_time - 选举开始时间
   * @property {Date} election.end_time - 选举结束时间
   * @property {Date} election.createdAt - 创建栓剂
   * @property {Date} election.updatedAt - 修改时间
   * 
   * {
   *  "success": true,
   *  "election": {
   *      "id": 5,
   *      "title": "优秀程序员555",
   *      "description": "选一位优选的程序员555",
   *      "is_active": true,
   *      "start_time": "2025-04-26T05:17:06.516Z",
   *      "end_time": "2025-04-27T01:17:06.516Z",
   *      "updatedAt": "2025-04-26T05:17:06.521Z",
   *      "createdAt": "2025-04-26T05:17:06.521Z"
   *  }
   * }
   */
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

  /**
   * @summary 更新选举信息（只更新选举的标题和描述）
   * @router put /api/admin/election/update
   * @request body integer id 更新的选举id
   * @request body string title 选举标题
   * @request body string description 选举描述
   * @property {Boolean} success - 是否成功
   * @property {String} message - 操作提示
   * 
   * {
   *  "success": true,
   *  "message": "更新成功！"
   * }
   */
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
  
  /**
   * @summary 开始选举
   * @router put /api/admin/election/start
   * @request body integer id 选举id
   * @request body integer durationHours 持续时间，单位：小时
   * @property {Boolean} success - 是否成功
   * @property {String} message - 操作提示
   * 
   * {
   *  "success": true,
   *  "message": "开始选举成功"
   * }
   */
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
  
  /**
   * @summary 结束选举
   * @router put /api/admin/election/end
   * @request body integer id 选举id
   * @property {Boolean} success - 是否成功
   * @property {String} message - 操作提示
   * 
   * {
   *  "success": true,
   *  "message": "结束选举成功"
   * }
   */
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
  
  /**
   * @summary 获取投票结果
   * @router get /api/admin/election/result
   * @request body integer electionId 选举id
   * @property {Boolean} success - 是否成功
   * @property {Array} data - 投票结果数据
   * @property {String} data.candidateName - 选举人名称
   * @property {String} data.candidateDescription - 选举人描述
   * @property {Number} data.voteCount - 获得票数
   * 
   * {
   *   "success": true,
   *   "data": [
   *       {
   *           "candidateName": "小滨",
   *           "candidateDescription": "程序员",
   *           "voteCount": 1
   *       },
   *       {
   *           "candidateName": "大滨",
   *           "candidateDescription": "后端程序员",
   *           "voteCount": 1
   *       }
   *   ]
   * }
   */
  async getResults() {
    const { ctx } = this;
    const { electionId } = ctx.request.body;
    const result = await ctx.service.vote.getResults(electionId);
    ctx.body = { success: true, data: result };
  }
}

module.exports = AdminController;