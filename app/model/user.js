'use strict';
module.exports = app => {
  const mongoose = app.mongoose;

  const Schema = mongoose.Schema; // Schema 模式就是个表

  const userSchema = new Schema({
    email: { type: 'string', required: true }, // 每个都要有新建时间和修改时间
    name: { type: 'string', required: true }, // 每个都要有新建时间和修改时间
    password: { type: 'string', required: true, select: false }, // 每个都要有新建时间和修改时间 select:false表示默认不查 单独语法查
    avatar: { type: 'string', required: false, default: '/user.png' }, // 每个都要有新建时间和修改时间
  }, { timestamps: true });
  return mongoose.model('User', userSchema); // User对应的是user数据库 自动加s的
};
