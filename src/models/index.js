'use strict';

const { sequelize, DataTypes } = require('../config/database');

/**
 * Core Model Binder
 * 
 * This file no longer defines business or identity models. 
 * Those are now handled by specialized plugins (stb-auth, stb-myaccount, etc.).
 * 
 * It remains as the central point for shared associations and the database instance.
 */

// ============================
// Associations (Late Binding Support)
// ============================
// todo: model filed override
// Plugin inside plugin
// Sanitize the password field, exclude fields option
// use finall inside findone

const associateModels = (allModels) => {
  const {
    // Identity (stb-auth)
    ApiUser, ApiRole, ApiPermission,
    AdminUser, AdminRole, AdminPermission,
    // Business (stb-myaccount)
    Negotiator, Property, Applicant, Offer, Appointment,
    // Extensions (my-plugin)
    Note
  } = allModels;

  const sanitize = require('../utils/sanitizer');

  // --- Global Model Decoration ---
  // Apply automatic sanitization to all models by overriding toJSON
  Object.values(allModels).forEach(model => {
    if (model.prototype && typeof model.prototype.toJSON === 'function') {
      const originalToJSON = model.prototype.toJSON;
      
      model.prototype.toJSON = function() {
        const data = originalToJSON.call(this);
        return sanitize.output(data, model);
      };

      // Attach static sanitize methods for manual use (Strapi-style)
      model.sanitizeInput = (data, options) => sanitize.input(data, model, options);
      model.sanitizeOutput = (data, options) => sanitize.output(data, model, options);
    }
  });

  // --- API Identity Relationships ---
  if (ApiRole && ApiPermission) {
    ApiRole.hasMany(ApiPermission);
    ApiPermission.belongsTo(ApiRole);
  }
  if (ApiRole && ApiUser) {
    ApiRole.hasMany(ApiUser);
    ApiUser.belongsTo(ApiRole);
  }

  console.log("ApiUser => ", ApiUser.sequelize);

  // --- Admin Identity Relationships ---
  if (AdminRole && AdminPermission) {
    AdminRole.hasMany(AdminPermission);
    AdminPermission.belongsTo(AdminRole);
  }
  if (AdminRole && AdminUser) {
    AdminRole.hasMany(AdminUser);
    AdminUser.belongsTo(AdminRole);
  }

  // --- CRM & Business Logic Relationships ---
  if (Negotiator && Property) {
    Negotiator.hasMany(Property, { foreignKey: 'NegotiatorId' });
    Property.belongsTo(Negotiator, { foreignKey: 'NegotiatorId' });
  }

  if (ApiUser && Applicant) {
    ApiUser.hasMany(Applicant, { foreignKey: 'ApiUserId' });
    Applicant.belongsTo(ApiUser, { foreignKey: 'ApiUserId' });
  }

  if (Property && Offer) {
    Property.hasMany(Offer, { foreignKey: 'PropertyId' });
    Offer.belongsTo(Property, { foreignKey: 'PropertyId' });
  }

  if (Applicant && Offer) {
    Applicant.hasMany(Offer, { foreignKey: 'ApplicantId' });
    Offer.belongsTo(Applicant, { foreignKey: 'ApplicantId' });
  }

  if (Negotiator && Offer) {
    Negotiator.hasMany(Offer, { foreignKey: 'NegotiatorId' });
    Offer.belongsTo(Negotiator, { foreignKey: 'NegotiatorId' });
  }

  if (Property && Appointment) {
    Property.hasMany(Appointment, { foreignKey: 'PropertyId' });
    Appointment.belongsTo(Property, { foreignKey: 'PropertyId' });
  }

  if (Applicant && Appointment) {
    Applicant.hasMany(Appointment, { foreignKey: 'ApplicantId' });
    Appointment.belongsTo(Applicant, { foreignKey: 'ApplicantId' });
  }

  if (Negotiator && Appointment) {
    Negotiator.hasMany(Appointment, { foreignKey: 'NegotiatorId' });
    Appointment.belongsTo(Negotiator, { foreignKey: 'NegotiatorId' });
  }

  // --- Extension Relationships ---
  if (Note && ApiUser) {
    ApiUser.hasMany(Note, { foreignKey: 'ApiUserId' });
    Note.belongsTo(ApiUser, { foreignKey: 'ApiUserId' });
  }
};


module.exports = {
  sequelize,
  DataTypes,
  associateModels
};
