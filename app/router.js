'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller, middleware } = app;
  
  // 用户认证相关
  router.post('/api/auth/send-verification', controller.auth.sendVerification);
  router.post('/api/auth/verify-email', controller.auth.verifyEmail);
  router.post('/api/auth/register', controller.auth.register);
  router.post('/api/auth/login', controller.auth.login);
  
  // 候选人相关
  router.get('/api/candidates/list', middleware.checkLogin(), controller.candidate.list);
  router.post('/api/candidates/create', middleware.checkLogin(), middleware.adminAuth(), middleware.checkElection(), controller.candidate.create);
  router.put('/api/candidates/update/:id', middleware.checkLogin(), middleware.adminAuth(), middleware.checkElection(), controller.candidate.update);
  router.put('/api/candidates/destroy/:id', middleware.checkLogin(), middleware.adminAuth(), middleware.checkElection(), controller.candidate.destroy);

  // 选举控制
  router.get('/api/admin/election/list', middleware.checkLogin(), middleware.adminAuth(), controller.admin.electionList);
  router.post('/api/admin/election/add', middleware.checkLogin(), middleware.adminAuth(), controller.admin.addElection);
  router.put('/api/admin/election/update', middleware.checkLogin(), middleware.adminAuth(), controller.admin.updateElection);
  router.put('/api/admin/election/start', middleware.checkLogin(), middleware.adminAuth(), controller.admin.startElection);
  router.put('/api/admin/election/end', middleware.checkLogin(), middleware.adminAuth(), controller.admin.endElection);
  
  // 获取指定选举的投票结果
  router.get('/api/admin/election/result', middleware.checkLogin(), middleware.adminAuth(), controller.admin.getResults);
  

  // 投票相关
  router.post('/api/vote', middleware.checkLogin(), controller.vote.submitVote);
};