'use strict';

const BaseController = require('./base');
const svgcaptcha = require('svg-captcha');
const fse = require('fs-extra');
class UtilController extends BaseController {
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
  async uploadfile() {
    const { ctx } = this;
    const file = ctx.request.files[0];
    console.log('file', file);
    try {
      await fse.move(file.filepath, this.config.UPLOAD_DIR + '/' + file.filename);

    } catch (e) {
      this.error('文件失败');
    }
    this.success({
      url: `/public/${file.filename}`,
    });
  }
}

module.exports = UtilController;
