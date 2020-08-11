'use strict';

const Controller = require('egg').Controller;

class Api extends Controller {
  index() {
    const { ctx, service } = this;
    /**
     * 从内存中读取缓存 memoryCache
     */
    ctx.body = {
      index: service.source.get('index'),
      lastUpdateBy: ctx.app.lastUpdateBy,
    };
  }
}

module.exports = Api;
