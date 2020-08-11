'use strict';

/**
 * type: all
 * 这个定时任务会在每一个 Worker 进程上每 10 分钟执行一次
 */
exports.schedule = {
  interval: '10m', // 10 分钟
  type: 'all', // 指定所有的 worker 都需要执行
};

exports.task = async function(ctx) {
  await ctx.service.source.update();
  ctx.app.lastUpdateBy = 'force';
};
