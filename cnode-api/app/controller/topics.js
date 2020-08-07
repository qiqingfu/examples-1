'use strict';

const Controller = require('egg').Controller;

class TopicsController extends Controller {
  constructor(ctx) {
    super(ctx);

    this.createRule = {
      accesstoken: 'string',
      title: 'string',
      tab: { type: 'enum', values: [ 'ask', 'share', 'job' ], required: false },
      content: 'string',
    };
  }

  /**
   * GET /api/v1/topics/:id
   * - params.id - Number
   * - params.mdrender - Boolean
   * - params.accesstoken - String
   */
  async show() {
    const { ctx } = this;

    ctx.body = await ctx.service.topics.show({
      id: ctx.params.id,
      mdrender: ctx.query.mdrender !== 'false',
      accesstoken: ctx.query.accesstoken || '',
    });
  }

  /**
   * GET /api/v2/topics
   */
  async index() {
    const { ctx } = this;

    ctx.validate({
      page: { type: 'string', format: /\d+/, required: false },
      tab: { type: 'enum', values: [ 'ask', 'share', 'job', 'good' ], required: false },
      limit: { type: 'string', format: /\d+/, required: false },
    }, ctx.query);

    ctx.body = await ctx.service.topics.list({
      page: ctx.query.page,
      tab: ctx.query.tab,
      limit: ctx.query.limit,
      mdrender: ctx.query.mdrender !== 'false',
    });
  }

  /**
   * POST /api/v1/topics
   *
   * accesstoken - String - required
   * title - String - required
   * tab - String
   * content - String - required
   */
  async create() {
    const { ctx } = this;
    ctx.validate(this.createRule);

    const id = await ctx.service.topics.create(ctx.request.body);
    ctx.body = {
      topic_id: id,
    };
    ctx.status = 201;
  }

  /**
   * PUT /api/v2/topics/:id
   *
   * accesstoken - String - required
   * title - String - required
   * tab - String
   * content - String - required
   */
  async update() {
    const { ctx } = this;
    const id = ctx.params.id;

    ctx.validate(this.createRule);
    await ctx.service.topics.update(Object.assign({ id }, ctx.request.body));
    ctx.status = 204;
  }
}

module.exports = TopicsController;
