'use strict';

/**
 * 定时检查远端的
 * @type {{interval: string, type: string}}
 *
 * type: 'worker'
 * 每台机器上只有一个 worker 会执行这个定时任务，每次执行定时任务的 worker 的选择是随机的
 *
 * type: 'all'
 * 每台机器上的每个 worker 都会执行这个定时任务
 */
exports.schedule = {
  interval: '10s',
  type: 'worker', // only run in one worker
};

exports.task = async function(ctx) {
  const needRefresh = await ctx.service.source.checkUpdate();
  if (!needRefresh) return;

  // notify all workers to update memory cache from `file`
  // 通知所有的 workers 从 file 更新内存缓存
  ctx.app.messenger.sendToApp('refresh', 'pull');
};
