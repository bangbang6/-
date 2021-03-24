'use strict';

const BaseController = require('./base');
const svgcaptcha = require('svg-captcha');
const path = require('path');
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
    const { name, hash } = ctx.request.body;
    const chunkPath = path.resolve(this.config.UPLOAD_DIR, hash);
    if (!fse.existsSync(chunkPath)) {
      fse.mkdir(chunkPath);
    }
    try {
      await fse.move(file.filepath, `${chunkPath}/${name}`);

    } catch (e) {
      this.error('文件失败');
    }
    this.success({
      url: `/public/${chunkPath}/${name}`,
    });
  }
  async merge() {
    const { ext, size, hash } = this.ctx.request.body;
    const destPath = path.resolve(this.config.UPLOAD_DIR, `${hash}.${ext}`); // 最终合并后文件的存储

    try {
      await this.ctx.service.user.mergeFile(destPath, hash, size);
      this.success({
        message: '合并成功',
        url: `/public/${hash}.${ext}`,
      });
    } catch (e) {
      this.error(e.message);
    }

  }
}

module.exports = UtilController;
