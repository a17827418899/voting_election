'use strict';

const Controller = require('egg').Controller;

/**
 * 用户认证相关
 */

class AuthController extends Controller {
  /**
   * @summary 发送验证码
   * @router post /api/auth/send-verification
   * @request body string email 邮箱
   * @property {Boolean} success - 是否成功
   * @property {String} message - 操作提示
   * 
   * {
   *  "success": true,
   *  "message": "验证码已发送"
   * }
   */
  async sendVerification() {
    const { ctx } = this;
    const { email } = ctx.request.body;

    // 验证邮箱格式
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      ctx.body = {
        success: false,
        message: '请输入有效的邮箱地址',
      };
      ctx.status = 400;
      return;
    }

    try {
      const sent = await ctx.service.auth.sendVerification(email);
      ctx.body = {
        success: sent,
        message: sent ? '验证码已发送' : '验证码发送失败',
      };
      if (!sent) {
        ctx.status = 500;
      }
    } catch (error) {
      ctx.logger.error('发送验证码失败:', error);
      ctx.body = {
        success: false,
        message: '发送验证码失败',
      };
      ctx.status = 500;
    }
  }

  /**
   * @summary 验证邮箱
   * @router post /api/auth/verify-email
   * @request body string email 邮箱
   * @request body integer code 验证码
   * @property {Boolean} success - 是否成功
   * @property {String} message - 操作提示
   * 
   * {
   *  "success": true,
   *  "message": "邮箱验证成功"
   * }
   */
  async verifyEmail() {
    const { ctx } = this;
    const { email, code } = ctx.request.body;

    if (!email || !code) {
      ctx.body = {
        success: false,
        message: '邮箱和验证码不能为空',
      };
      ctx.status = 400;
      return;
    }

    try {
      const verified = await ctx.service.auth.verifyEmail(email, code);
      ctx.body = {
        success: verified,
        message: verified ? '邮箱验证成功' : '验证码无效或已过期',
      };
      if (!verified) {
        ctx.status = 400;
      }
    } catch (error) {
      ctx.logger.error('邮箱验证失败:', error);
      ctx.body = {
        success: false,
        message: '邮箱验证失败',
      };
      ctx.status = 500;
    }
  }
 
  /**
   * @summary 用户注册
   * @router post /api/auth/register
   * @request body string email 邮箱
   * @request body string password 登录密码
   * @property {Boolean} success - 是否成功
   * @property {String} message - 操作提示
   * @property {Object} data - data
   * @property {String} data.email - 注册邮箱
   * 
   * {
   *  "success": true,
   *  "message": "注册成功",
   *  "data": {
   *      "email": "2192559956@qq.com"
   *  }
   * }
   */
  async register() {
    const { ctx } = this;
    const { email, password } = ctx.request.body;

    // 验证输入
    if (!email || !password) {
      ctx.body = {
        success: false,
        message: '邮箱和密码不能为空',
      };
      ctx.status = 400;
      return;
    }

    if (password.length < 6) {
      ctx.body = {
        success: false,
        message: '密码长度不能少于6位',
      };
      ctx.status = 400;
      return;
    }

    try {
      const user = await ctx.service.auth.register(email, password);
      ctx.body = {
        success: true,
        message: '注册成功',
        data: {
          email: user.email,
        },
      };
    } catch (error) {
      ctx.logger.error('注册失败:', error);
      ctx.body = {
        success: false,
        message: error.message || '注册失败',
      };
      ctx.status = error.status || 500;
    }
  }

  /**
   * @summary 用户登录
   * @router post /api/auth/login
   * @request body string email 邮箱
   * @request body string password 登录密码
   * @property {Boolean} success - 是否成功
   * @property {String} message - 操作提示
   * @property {Object} data - data
   * @property {String} data.token - 登录成功返回的token，用于后续认证
   * @property {Object} data.user - 登录用户
   * @property {String} data.user.email - 登录邮箱
   * 
   * {
   *   "success": true,
   *   "message": "登录成功",
   *   "data": {
   *       "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoiMjE5MjU1OTk1NkBxcS5jb20iLCJpYXQiOjE3NDU1NzM4NzUsImV4cCI6MTc0NTY2MDI3NX0.C7LjwmQqbcOr799ErXuuTt_SfHLzq9Z5oYbDUfae12g",
   *       "user": {
   *           "email": "2192559956@qq.com"
   *       }
   *   }
   * }
   */
  async login() {
    const { ctx } = this;
    const { email, password } = ctx.request.body;

    if (!email || !password) {
      ctx.body = {
        success: false,
        message: '邮箱和密码不能为空',
      };
      ctx.status = 400;
      return;
    }

    try {
      const { token, user } = await ctx.service.auth.login(email, password);
      ctx.body = {
        success: true,
        message: '登录成功',
        data: {
          token,
          user,
        },
      };
    } catch (error) {
      ctx.logger.error('登录失败:', error);
      ctx.body = {
        success: false,
        message: error.message || '登录失败',
      };
      ctx.status = error.status || 401;
    }
  }
}

module.exports = AuthController;