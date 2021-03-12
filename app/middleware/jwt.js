// 解析token的中间件  鉴权层
'use strict';

const jwt = require('jsonwebtoken');
// 就是koa中间件语法
module.exports = ({ app }) => {
  return async function verify(ctx, next) {
    if (!ctx.request.headers.authorization) {
      ctx.body = {
        code: -666,
        message: '用户没登陆',
      };
      return;
    }
    const token = ctx.request.headers.authorization.replace('Bearer', '');
    try {
      const res = await jwt.verify(token, app.config.jwt.secret); // 解码
      ctx.email = res.email;
      ctx.userId = res._id;
      await next();
    } catch (e) {
      if (e.name === 'TokenExpiredError') {
        ctx.body = {
          code: -666,
          message: '用户信息过期',
        };
      } else {
        console.log('e', e);
        ctx.body = {
          code: -1,
          message: '用户信息出错',
        };
      }
    }

  };

};
