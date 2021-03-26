'use strict';
const { Service } = require('egg');
const nodemailer = require('nodemailer');
const fse = require('fs-extra');
const path = require('path');

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
  async mergeFile(destPath, hash, size) {
    let chunks = await fse.readdir(path.resolve(this.config.UPLOAD_DIR, hash));
    chunks.sort((a, b) => a.split('-')[1] - b.split('-')[1]);
    chunks = chunks.map(cn => path.resolve(this.config.UPLOAD_DIR, hash, cn));
    await this.mergeChunks(chunks, destPath, size);
  }
  async mergeChunks(chunks, destPath, size) {
    // chunks每一个chunk的路径 用ReadStream读取
    const pipStream = (filePath, writeStream) => new Promise(resolve => {
      const readStream = fse.createReadStream(filePath);
      readStream.on('end', () => {
        /*  fse.unlinkSync(filePath); */
        resolve();
      });
      readStream.pipe(writeStream);
    });
    await Promise.all(
      chunks.map((file, index) => {
        return pipStream(file, fse.createWriteStream(destPath, { // 在destPath的这个文件的第start-end字节里写数据
          start: index * size,
          end: (index + 1) * size,
        }));
      })
    );
  }
}
module.exports = UserService;
