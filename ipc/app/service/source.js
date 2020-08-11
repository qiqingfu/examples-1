'use strict';

const sleep = require('mz-modules/sleep');
const Service = require('egg').Service;

let memoryCache = {};

class Source extends Service {

  get(key) {
    return memoryCache[key];
  }

  async checkUpdate() {
    // check if remote data source has changed
    // 检查远端数据源是否已更改
    // 随机的 updated 值
    const updated = await mockCheck();
    this.ctx.logger.info('check update response %s', updated);
    return updated;
  }

  async update() {
    // update memory cache from remote
    // 从远程更新内存缓存
    memoryCache = await mockFetch();
    this.ctx.logger.info('update memory cache from remote: %j', memoryCache);
  }
}

module.exports = Source;

let index = 0;
async function mockFetch() {
  await sleep(100);
  return {
    index: index++,
  };
}

async function mockCheck() {
  await sleep(100);
  return Math.random() > 0.5;
}
