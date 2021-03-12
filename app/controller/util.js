'use strict';

const Controller = require('egg').Controller;
const svgcaptcha = require('svg-captcha');
class UtilController extends Controller {
  async captcha() {
    const { ctx } = this;
    const captcha = svgcaptcha.create({
      size: 4,
      fontSize: 50,
      width: 100,
      height: 40,
      noise: 3,
    });
    ctx.session.captcha = captcha.text; // !将验证码存到session里面 采用jwt+session结构 egg自带的
    ctx.response.type = 'image/svg+xml'; // 返回svg的格式
    ctx.body = captcha.data;
  }
}

module.exports = UtilController;
