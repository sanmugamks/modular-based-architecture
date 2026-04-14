'use strict';

/**
 * ApplicantController for stb-myaccount plugin
 */
module.exports = ({ models }) => {
  const { Applicant, ApiUser } = models;

  return {
    // GET /api/applicants
    async findAll(ctx) {
      try {
        const applicants = await Applicant.findAll({ include: [ApiUser] });
        ctx.body = { data: applicants, count: applicants.length };
      } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'Failed to fetch applicants', details: error.message };
      }
    },

    // GET /api/applicants/:id
    async findOne(ctx) {
      try {
        const applicant = await Applicant.findByPk(ctx.params.id, { include: [ApiUser] });
        if (!applicant) {
          ctx.status = 404;
          ctx.body = { error: 'Applicant not found' };
          return;
        }
        ctx.body = { data: applicant };
      } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'Failed to fetch applicant', details: error.message };
      }
    },

    // POST /api/applicants
    async create(ctx) {
      try {
        const { crm_id, marketing_mode, status, ApiUserId } = ctx.request.body;
        const applicant = await Applicant.create({ crm_id, marketing_mode, status, ApiUserId });
        ctx.status = 201;
        ctx.body = { data: applicant };
      } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'Failed to create applicant', details: error.message };
      }
    },

    // PUT /api/applicants/:id
    async update(ctx) {
      try {
        const applicant = await Applicant.findByPk(ctx.params.id);
        if (!applicant) {
          ctx.status = 404;
          ctx.body = { error: 'Applicant not found' };
          return;
        }
        await applicant.update(ctx.request.body);
        ctx.body = { data: applicant };
      } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'Failed to update applicant', details: error.message };
      }
    },

    // DELETE /api/applicants/:id
    async destroy(ctx) {
      try {
        const applicant = await Applicant.findByPk(ctx.params.id);
        if (!applicant) {
          ctx.status = 404;
          ctx.body = { error: 'Applicant not found' };
          return;
        }
        await applicant.destroy();
        ctx.body = { message: 'Applicant deleted successfully' };
      } catch (error) {
        ctx.status = 500;
        ctx.body = { error: 'Failed to delete applicant', details: error.message };
      }
    },
  };
};
