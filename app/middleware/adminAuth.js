/**
 * 检查用户管理员权限中间件
 */
'use strict';

module.exports = () => {
  return async function adminAuth(ctx, next) {
    const { email, isAdmin } = ctx.session.user
    // 1.检查是否是管理员
    if (!isAdmin) {
      ctx.throw(403, '无权访问，需要管理员权限');
    }
    // 2. 记录管理员操作日志
    ctx.logger.info(`管理员操作: ${email} 访问 ${ctx.method} ${ctx.url}`);
    await next();
  };
};