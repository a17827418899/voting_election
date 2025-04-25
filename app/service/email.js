const Service = require('egg').Service;
const nodemailer = require('nodemailer');

class EmailService extends Service {
  async sendVerificationCode(email, code) {
    const { app } = this;
    const transporter = nodemailer.createTransport(app.config.email);
    
    const mailOptions = {
      from: app.config.email.auth.user,
      to: email,
      subject: '您的投票系统验证码',
      text: `您的验证码是: ${code}，有效期为10分钟。`,
      html: `<p>您的验证码是: <strong>${code}</strong>，有效期为10分钟。</p>`
    };
    
    try {
      await transporter.sendMail(mailOptions);
      return true;
    } catch (error) {
      this.ctx.logger.error('发送邮件失败:', error);
      return false;
    }
  }
}

module.exports = EmailService;