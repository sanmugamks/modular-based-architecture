'use strict';

/**
 * PropertyController for stb-myaccount plugin
 */
module.exports = ({ models }) => {
  const { Property, Negotiator } = models;

  const controllers = {
    // GET /api/properties
    async findAll(ctx) {
      try {
        const properties = await Property.findAll({ include: [Negotiator] });
        ctx.body = { data: properties, count: properties.length };
      } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'Failed to fetch properties', details: error.message };
      }
    },

    // GET /api/properties/:id
    async findOne(ctx) {
      try {
        const property = await Property.findByPk(ctx.params.id, { include: [Negotiator] });
        if (!property) {
          ctx.status = 404;
          ctx.body = { error: 'Property not found' };
          return;
        }
        ctx.body = { data: property };
      } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'Failed to fetch property', details: error.message };
      }
    },

    // POST /api/properties
    async create(ctx) {
      try {
        const { title, price, status, crm_id, NegotiatorId } = ctx.request.body;
        if (!title) {
          ctx.status = 400;
          ctx.body = { error: 'Title is required' };
          return;
        }
        const property = await Property.create({ title, price, status, crm_id, NegotiatorId });
        ctx.status = 201;
        ctx.body = { data: property };
      } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'Failed to create property', details: error.message };
      }
    },

    // PUT /api/properties/:id
    async update(ctx) {
      try {
        const property = await Property.findByPk(ctx.params.id);
        if (!property) {
          ctx.status = 404;
          ctx.body = { error: 'Property not found' };
          return;
        }
        await property.update(ctx.request.body);
        ctx.body = { data: property };
      } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'Failed to update property', details: error.message };
      }
    },

    // DELETE /api/properties/:id
    async destroy(ctx) {
      try {
        const property = await Property.findByPk(ctx.params.id);
        if (!property) {
          ctx.status = 404;
          ctx.body = { error: 'Property not found' };
          return;
        }
        await property.destroy();
        ctx.body = { message: 'Property deleted successfully' };
      } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'Failed to delete property', details: error.message };
      }
    },
  };

  return controllers;
};
