'use strict';
const { Service } = require('egg');
const nodemailer = require('nodemailer');
const emailConfig = {
  userEmail: '15798015790@163.com',
  transporter: nodemailer.createTransport({ // 163邮箱不用具体SMTP 端口信息
    service: '163',
    secureConnect: true,
    auth: {
      user: '15798015790@163.com',
      pass: '15798015790liao',
    },
  }),
};
class UserService extends Service {
  async sendMail(email, subject, text, html) {
    const mailOptions = {
      from: emailConfig.userEmail,
      cc: emailConfig.userEmail,
      to: email,
      subject,
      text,
      html,
    };
    try {
      await emailConfig.transporter.sendMail(mailOptions);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
module.exports = UserService;
