'use strict';

/**
 * OfferController for stb-myaccount plugin
 */
module.exports = ({ models, config }) => {
  const { Offer, Property, Applicant, Negotiator } = models;

  console.log('config => in controller   ', config);

  const controllers = {
    // GET /api/offers
    async findAll(ctx) {
      try {
        console.log(
          '[OfferController] Accessing stb-auth services:',
          Object.keys(ctx.plugins['stb-auth'].services || {})
        );

        const offers = await Offer.findAll({ include: [Property, Applicant, Negotiator] });
        ctx.body = { data: offers, count: offers.length };
      } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'Failed to fetch offers', details: error.message };
      }
    },

    // GET /api/offers/:id
    async findOne(ctx) {
      try {
        console.log('[OfferController] calling findAll from findOne as example...');
        // Example: calling another method in the same controller
        // Note: we'd usually just call the logic, but this demonstrates the pattern
        // await controllers.findAll(ctx);

        const offer = await Offer.findByPk(ctx.params.id, {
          include: [Property, Applicant, Negotiator],
        });
        if (!offer) {
          ctx.status = 404;
          ctx.body = { error: 'Offer not found' };
          return;
        }
        ctx.body = { data: offer };
      } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'Failed to fetch offer', details: error.message };
      }
    },

    // POST /api/offers
    async create(ctx) {
      try {
        const { crm_id, amount, status, date, PropertyId, ApplicantId, NegotiatorId } =
          ctx.request.body;
        if (!amount) {
          ctx.status = 400;
          ctx.body = { error: 'Amount is required' };
          return;
        }
        const offer = await Offer.create({
          crm_id,
          amount,
          status,
          date,
          PropertyId,
          ApplicantId,
          NegotiatorId,
        });
        ctx.status = 201;
        ctx.body = { data: offer };
      } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'Failed to create offer', details: error.message };
      }
    },

    // PUT /api/offers/:id
    async update(ctx) {
      try {
        const offer = await Offer.findByPk(ctx.params.id);
        if (!offer) {
          ctx.status = 404;
          ctx.body = { error: 'Offer not found' };
          return;
        }
        await offer.update(ctx.request.body);
        ctx.body = { data: offer };
      } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'Failed to update offer', details: error.message };
      }
    },

    // DELETE /api/offers/:id
    async destroy(ctx) {
      try {
        const offer = await Offer.findByPk(ctx.params.id);
        if (!offer) {
          ctx.status = 404;
          ctx.body = { error: 'Offer not found' };
          return;
        }
        await offer.destroy();
        ctx.body = { message: 'Offer deleted successfully' };
      } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'Failed to delete offer', details: error.message };
      }
    },
  };

  return controllers;
};
