'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const jwtMid = app.middleware.jwt({ app }); // 在对应router里面配置中间件 类似koa中间件在访问路由
  router.get('/', controller.home.index);
  router.post('/uploadfile', controller.util.uploadfile);
  router.get('/captcha', jwtMid, controller.util.captcha); // !对应conrroller文件夹下的util文件的chaptha方法
  router.group({ name: 'user', prefix: '/user' }, router => {
    const { info, register, login, verify, sendEmailCode } = controller.user;
    router.post('/register', register);
    router.post('/login', login);
    router.get('/info', jwtMid, info);
    router.get('/verify', verify);
    router.post('/sendEmailCode', sendEmailCode);

  });

};
