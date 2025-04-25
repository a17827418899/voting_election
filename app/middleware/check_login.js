/**
 * 检查用户登录中间件
 */
'use strict';

module.exports = options => {
  return async function checkLogin(ctx, next) {
    // 1. 检查是否有Authorization头， 获取并验证Token，使用postman进行请求的时候需要在headers中增加Authorization，值为登录后返回的token
    const authHeader = ctx.get('Authorization');
    if (!authHeader) {
      ctx.throw(401, '未提供认证令牌');
    }
    
    // 2. 验证JWT令牌格式 (Bearer token)
    const parts = authHeader.trim().split(' ');
    const token = parts[1];
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      ctx.throw(401, '令牌格式错误，格式应为: Bearer [token]');
    }

    try {
      // 2. 验证JWT有效性
      const decoded = ctx.app.jwt.verify(token, ctx.app.config.jwt.secret);
      
      // 3. 检查用户是否存在且状态正常
      const user = await ctx.model.User.findByPk(decoded.userId, {
        attributes: ['id', 'email', 'is_admin', 'is_verified']
      });
      
      if (!user) {
        ctx.throw(401, '用户不存在', { code: 'USER_NOT_FOUND' });
      }
      
      if (!user.is_verified) {
        ctx.throw(403, '邮箱未验证', { code: 'EMAIL_NOT_VERIFIED' });
      }
      
      // 4. 挂载用户信息到上下文
      ctx.session.user = {
        id: user.id,
        email: user.email,
        isAdmin: user.is_admin
      };
      
      // 5. 记录访问日志
      ctx.logger.info(
        `[Auth] 用户访问: userID=${user.id}, path=${ctx.path}, ip=${ctx.ip}`
      );
      
      await next();
    } catch (err) {
      ctx.logger.error('[Auth] 认证失败:', err);
  
      const errorMap = {
        TokenExpiredError: { status: 401, message: '令牌已过期', code: 'TOKEN_EXPIRED' },
        JsonWebTokenError: { status: 401, message: '无效的令牌', code: 'INVALID_TOKEN' },
        NotBeforeError: { status: 401, message: '令牌尚未生效', code: 'TOKEN_NOT_ACTIVE' }
      };
      
      const errorInfo = errorMap[err.name] || { 
        status: err.status || 500,
        message: err.message || '认证失败',
        code: err.code || 'AUTH_FAILED'
      };
      
      ctx.throw(errorInfo.status, errorInfo.message, { code: errorInfo.code });
    }
  };
};