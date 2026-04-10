const { Appointment, Property, Applicant, Negotiator } = require('../models');

module.exports = {

  // GET /api/appointments
  async findAll(ctx) {
    try {
      const appointments = await Appointment.findAll({ include: [Property, Applicant, Negotiator] });
      ctx.body = { data: appointments, count: appointments.length };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: 'Failed to fetch appointments', details: error.message };
    }
  },

  // GET /api/appointments/:id
  async findOne(ctx) {
    try {
      const appointment = await Appointment.findByPk(ctx.params.id, { include: [Property, Applicant, Negotiator] });
      if (!appointment) {
        ctx.status = 404;
        ctx.body = { error: 'Appointment not found' };
        return;
      }
      ctx.body = { data: appointment };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: 'Failed to fetch appointment', details: error.message };
    }
  },

  // POST /api/appointments
  async create(ctx) {
    try {
      const { crm_id, appointment_type, appointment_starttime, appointment_endtime, PropertyId, ApplicantId, NegotiatorId } = ctx.request.body;
      if (!appointment_starttime) {
        ctx.status = 400;
        ctx.body = { error: 'appointment_starttime is required' };
        return;
      }
      const appointment = await Appointment.create({
        crm_id, appointment_type, appointment_starttime, appointment_endtime,
        PropertyId, ApplicantId, NegotiatorId,
      });
      ctx.status = 201;
      ctx.body = { data: appointment };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: 'Failed to create appointment', details: error.message };
    }
  },

  // PUT /api/appointments/:id
  async update(ctx) {
    try {
      const appointment = await Appointment.findByPk(ctx.params.id);
      if (!appointment) {
        ctx.status = 404;
        ctx.body = { error: 'Appointment not found' };
        return;
      }
      await appointment.update(ctx.request.body);
      ctx.body = { data: appointment };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: 'Failed to update appointment', details: error.message };
    }
  },

  // DELETE /api/appointments/:id
  async destroy(ctx) {
    try {
      const appointment = await Appointment.findByPk(ctx.params.id);
      if (!appointment) {
        ctx.status = 404;
        ctx.body = { error: 'Appointment not found' };
        return;
      }
      await appointment.destroy();
      ctx.body = { message: 'Appointment deleted successfully' };
    } catch (error) {
      ctx.status = 500;
      ctx.body = { error: 'Failed to delete appointment', details: error.message };
    }
  },
};
