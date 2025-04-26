const Service = require('egg').Service;
const { v4: uuidv4 } = require('uuid');
const crypto = require('crypto');

class AuthService extends Service {
  /**
   * 生成验证码
   */
  generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }
  
  /**
   * 发送验证码
   * @param {String} email - 邮箱
   * @return Boolean
   */
  async sendVerification(email) {
    const { ctx, app } = this;
    const code = this.generateVerificationCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10分钟后过期
    
    // 检查是否已存在用戶
    let user = await ctx.model.User.findOne({ where: { email } });
    
    if (!user) {
      user = await ctx.model.User.create({
        email,
        verification_code: code,
        code_expires_at: expiresAt,
        password: 'temp_password' // 临时密码，正式注册时会更新
      });
    } else {
      // 更新验证码和过期时间
      await user.update({
        verification_code: code,
        code_expires_at: expiresAt
      });
    }
    
    // 发送邮件
    const sent = await ctx.service.email.sendVerificationCode(email, code);
    
    return sent;
  }
  
  /**
   * 验证邮箱
   * @param {String} email - 邮箱
   * @param {Number} code - 验证码
   * @return Boolean
   */
  async verifyEmail(email, code) {
    const { ctx } = this;
    const user = await ctx.model.User.findOne({ 
      where: { 
        email,
        verification_code: code,
        code_expires_at: { [ctx.app.Sequelize.Op.gt]: new Date() }
      }
    });
    
    if (!user) {
      return false;
    }
    
    await user.update({
      is_verified: true,
      verification_code: null,
      code_expires_at: null
    });
    
    return true;
  }
  
  /**
   * 用户注册
   * @param {String} email - 邮箱
   * @param {String} password - 登录密码
   * @return Boolean
   */
  async register(email, password) {
    const { ctx } = this;
    const user = await ctx.model.User.findOne({ where: { email } });
    
    if (!user || !user.is_verified) {
      ctx.throw(400, '邮箱未验证或不存在！');
    }
    
    // 加密密碼
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    
    await user.update({
      password: hashedPassword
    });
    
    return user;
  }

  /**
   * 用户登录
   * @param {String} email - 邮箱
   * @param {String} password - 登录密码
   * @return Object
   */
  async login(email, password) {
    const { ctx, app } = this;
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    
    const user = await ctx.model.User.findOne({ 
      where: { 
        email,
        password: hashedPassword,
        is_verified: true
      }
    });
    
    if (!user) {
      ctx.throw(401, '无效的凭证');
    }
    
    // 生成JWT令牌
    const token = app.jwt.sign({
      userId: user.id,
      email: user.email
    }, app.config.jwt.secret, { expiresIn: '24h' });
    
    return { token, user: { email: user.email } };
  }
}

module.exports = AuthService;