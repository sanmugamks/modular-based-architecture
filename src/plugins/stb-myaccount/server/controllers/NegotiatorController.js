'use strict';

/**
 * NegotiatorController for stb-myaccount plugin
 */
module.exports = ({ models }) => {
  const { Negotiator } = models;

  const controllers = {
    // GET /api/negotiators
    async findAll(ctx) {
      try {
        const negotiators = await Negotiator.findAll();
        ctx.body = { data: negotiators, count: negotiators.length };
      } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'Failed to fetch negotiators', details: error.message };
      }
    },

    // GET /api/negotiators/:id
    async findOne(ctx) {
      try {
        const negotiator = await Negotiator.findByPk(ctx.params.id);
        if (!negotiator) {
          ctx.status = 404;
          ctx.body = { error: 'Negotiator not found' };
          return;
        }
        ctx.body = { data: negotiator };
      } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'Failed to fetch negotiator', details: error.message };
      }
    },

    // POST /api/negotiators
    async create(ctx) {
      try {
        const { name, email, crm_id } = ctx.request.body;
        if (!name || !email) {
          ctx.status = 400;
          ctx.body = { error: 'Name and email are required' };
          return;
        }
        const negotiator = await Negotiator.create({ name, email, crm_id });
        ctx.status = 201;
        ctx.body = { data: negotiator };
      } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'Failed to create negotiator', details: error.message };
      }
    },

    // PUT /api/negotiators/:id
    async update(ctx) {
      try {
        const negotiator = await Negotiator.findByPk(ctx.params.id);
        if (!negotiator) {
          ctx.status = 404;
          ctx.body = { error: 'Negotiator not found' };
          return;
        }
        await negotiator.update(ctx.request.body);
        ctx.body = { data: negotiator };
      } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'Failed to update negotiator', details: error.message };
      }
    },

    // DELETE /api/negotiators/:id
    async destroy(ctx) {
      try {
        const negotiator = await Negotiator.findByPk(ctx.params.id);
        if (!negotiator) {
          ctx.status = 404;
          ctx.body = { error: 'Negotiator not found' };
          return;
        }
        await negotiator.destroy();
        ctx.body = { message: 'Negotiator deleted successfully' };
      } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'Failed to delete negotiator', details: error.message };
      }
    },
  };

  return controllers;
};
