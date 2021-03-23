// egg都是基于继承 我们之前写啦一个基本的controller 这里继承这个controller就行 不用继承原生的controller
'use strict';
const BaseController = require('./base');
const md5 = require('md5'); // 就是有一套固定的加密 key值一样就是加密出一样的
const jwt = require('jsonwebtoken');
const rule = {
  email: { type: 'string' },
  name: 'string',
  password: 'string',
  captcha: 'string',
};
class UserController extends BaseController {
  async login() {
    const { ctx, app } = this;
    const { email, password, captcha } = this.ctx.request.body;
    if (captcha !== ctx.session.emailCode.toString()) {
      return this.error('验证码错误');
    }

    const user = await this.ctx.model.User.findOne({
      email,
      password: md5(password + app.config.password.secret), // 加上随机字符串加密
    });
    console.log('user', user);
    if (!user) {
      return this.error('用户名密码错误');
    }
    const token = jwt.sign({
      _id: user._id,
      email,
    }, app.config.jwt.secret, {
      expiresIn: '10h',
    });
    this.success({ token, email: user.email, name: user.name });
  }
  async register() {
    const { ctx, app } = this;
    try {
      this.ctx.validate(rule); // 引入插件都是自带到this.ctx上
    } catch (e) {
      return this.error('参数校验失败', -1, e.errors); // 调用base类的函数
    }

    const { email, password, captcha, name } = ctx.request.body;
    if (captcha.toUpperCase() === ctx.session.captcha.toUpperCase()) {
      if (await this.checkEmail(email)) {
        return this.error('邮箱重复了');
      }
      try {
        const res = await this.ctx.model.User.create({
          email,
          name,
          password: md5(password + app.config.password.secret), // 加上随机字符串加密
        });
        if (res.id) {
          this.success({ msg: 'ok' }); // 调用base类的函数
        }
      } catch (e) {
        this.error('入库失败', -1, e.errors);
      }


    } else {
      return this.error('验证码错误');
    }

  }
  async checkEmail(email) {
    const user = await this.ctx.model.User.findOne({ email }); // /moogose插件自动将model文件夹的放到ctxs上
    return user;
  }
  // 用户详情
  async info() {

    const { email } = this.ctx;
    const user = await this.checkEmail(email);
    this.success(user);
  }
  async verify() {
    this.ctx.body = 'login';
  }
  async sendEmailCode() {
    const { email } = this.ctx.request.body;
    const code = Math.random().toString().slice(2, 6);
    this.ctx.session.emailCode = code; // 存到session全局便于后面校验
    const subject = '验证码';
    const text = '';
    const html = `<h2>华科计算所</h2><span>验证码为${code}</span>`;
    try {
      const hasSend = await this.service.user.sendMail(email, subject, text, html);
      if (hasSend) {
        this.message('发送成功');

      } else {
        this.error('发送失败');

      }

    } catch (e) {
      this.error('发送失败');
    }

  }
}
module.exports = UserController;

