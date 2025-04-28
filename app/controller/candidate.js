const Controller = require('egg').Controller;

/**
 * 候选人相关
 */

class AdminController extends Controller { 
  /**
   * @summary 获取指定选举的候选人列表
   * @router get /api/candidates/list
   * @request body integer electionId 选举id
   * @request body integer page 页码，默认1
   * @request body integer pageSize 每页数量，默认10
   * @request body string keyword 搜索关键词(可选)
   * @property {Number} total - 候选人总数
   * @property {Array} list - 候选人列表数据
   * @property {Number} list.id - 候选人id
   * @property {Number} list.election_id - 所属选举id
   * @property {String} list.name - 候选人名称
   * @property {String} list.description - 候选人描述
   * @property {Date} list.createdAt - 创建时间
   * @property {Date} list.updatedAt - 修改时间
   * @property {Number} currentPage - 当前页数
   * @property {Number} totalPages - 总页数
   * 
   * {
   *   "total": 2,
   *   "list": [
   *       {
   *           "id": 2,
   *           "name": "大滨",
   *           "election_id": 3,
   *           "description": "后端程序员",
   *           "createdAt": "2025-04-25T10:04:50.000Z",
   *           "updatedAt": "2025-04-25T10:04:50.000Z"
   *       },
   *       {
   *           "id": 1,
   *           "name": "小滨",
   *           "election_id": 4,
   *           "description": "程序员",
   *           "createdAt": "2025-04-25T09:57:29.000Z",
   *           "updatedAt": "2025-04-25T10:03:45.000Z"
   *       }
   *   ],
   *   "currentPage": 1,
   *   "totalPages": 1
   * }
   */
  async list() {
    const { ctx } = this;
    const { electionId, page, pageSize, keyword } = ctx.request.body;
    ctx.body = await ctx.service.candidate.list(electionId, page, pageSize, keyword);
  }
  
  /**
   * @summary 新增候选人
   * @router post /api/candidates/create
   * @request body integer electionId 选举id
   * @request body string name 新增候选人名称
   * @request body string description 新增候选人描述
   * @property {Number} id - 候选人id
   * @property {Number} election_id - 所属选举id
   * @property {String} name - 候选人名称
   * @property {String} description - 候选人描述
   * @property {Date} createdAt - 创建时间
   * @property {Date} updatedAt - 修改时间
   * 
   * {
   *  "id": 5,
   *  "name": "大大滨",
   *  "description": "后端程序员111",
   *  "election_id": 3,
   *  "updatedAt": "2025-04-26T05:39:12.334Z",
   *  "createdAt": "2025-04-26T05:39:12.334Z"
   * }
   */
  async create() {
    const { ctx } = this;
    const { electionId, name, description } = ctx.request.body;
    ctx.body = await ctx.service.candidate.create(electionId, name, description);
  }

  /**
   * @summary 修改候选人信息
   * @router put /api/candidates/update/:id
   * @request query ingeter id 候选人id
   * @request body string name 修改的候选人名称
   * @request body string description 修改的候选人描述
   * @property {Number} id - 候选人id
   * @property {String} name - 修改后候选人名称
   * @property {String} description - 修改后候选人描述
   * @property {Date} createdAt - 创建时间
   * @property {Date} updatedAt - 修改时间
   * 
   * {
   *  "id": 5,
   *  "name": "小小滨",
   *  "description": "后端程序员111",
   *  "updatedAt": "2025-04-26T05:39:12.334Z",
   *  "createdAt": "2025-04-26T05:39:12.334Z"
   * }
   */
  async update() {
    const { ctx } = this;
    const { id } = ctx.params;
    const { name, description } = ctx.request.body;
    ctx.body = await ctx.service.candidate.update(id, { name, description });
  }

  /**
   * @summary 删除候选人
   * @router put /api/candidates/update/:id
   * @request query ingeter id 候选人id
   * @property {Boolean} success - 是否成功
   * @property {String} message - 操作描述
   * 
   * {
   *   "success": true,
   *   "message": "删除成功"
   * }
   */
  async destroy() {
    const { ctx } = this;
    const { id } = ctx.params;
    ctx.body = await ctx.service.candidate.delete(id);
  }
}

module.exports = AdminController;