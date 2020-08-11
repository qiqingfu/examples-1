'use strict';

module.exports = app => {
  app.beforeStart(async () => {
    // ensure memory cache exists before app ready
    // app.runSchedule 手动执行定时任务
    // https://eggjs.org/zh-cn/basics/schedule.html#%E6%89%8B%E5%8A%A8%E6%89%A7%E8%A1%8C%E5%AE%9A%E6%97%B6%E4%BB%BB%E5%8A%A1
    // 接受一个绝对路径或相对路径
    app.logger.info('手动执行定时任务, force_refresh');
    await app.runSchedule('force_refresh');
  });

  /**
   * 多进程模型和进程间通讯（IPC）
   */
  const { messenger } = app;

  /**
   * 在 messenger 上监听对应的 refresh 事件，就可以收到其他进程发送来的信息
   */
  messenger.on('refresh', by => {
    app.logger.info('start update by %s', by);
    // create an anonymous context to access service
    // 创建一个匿名上下文，可以调用 service 服务
    const ctx = app.createAnonymousContext();
    // a convenient way to excute with generator function
    // can replaced by `co`
    /**
     * 在后台运行 async 函数，运行结束回调通知
     */
    ctx.runInBackground(async () => {
      await ctx.service.source.update();
      app.lastUpdateBy = by;
    });
  });
};
