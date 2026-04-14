'use strict';

/**
 * Models for stb-myaccount plugin (Core Business Domain)
 */
module.exports = (sequelize, DataTypes) => {
  const Negotiator = sequelize.define('Negotiator', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    crm_id: { type: DataTypes.STRING }
  });

  const Property = sequelize.define('Property', {
    title: { type: DataTypes.STRING, allowNull: false },
    price: { type: DataTypes.FLOAT },
    status: { type: DataTypes.STRING, defaultValue: 'ToLet' },
    crm_id: { type: DataTypes.STRING }
  });

  const Applicant = sequelize.define('Applicant', {
    crm_id: { type: DataTypes.STRING },
    marketing_mode: { type: DataTypes.STRING, defaultValue: 'buying' }, // 'buying' or 'letting'
    status: { type: DataTypes.STRING, defaultValue: 'active' },
  });

  const Offer = sequelize.define('Offer', {
    crm_id: { type: DataTypes.STRING },
    amount: { type: DataTypes.FLOAT, allowNull: false },
    status: { type: DataTypes.STRING, defaultValue: 'pending' }, // pending, accepted, rejected, withdrawn
    date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  });

  const Appointment = sequelize.define('Appointment', {
    crm_id: { type: DataTypes.STRING },
    appointment_type: { type: DataTypes.STRING, defaultValue: 'VW' }, // VW = Viewing, VL = Valuation
    appointment_starttime: { type: DataTypes.DATE, allowNull: false },
    appointment_endtime: { type: DataTypes.DATE },
    cancelled: { type: DataTypes.BOOLEAN, defaultValue: false },
    confirmed: { type: DataTypes.BOOLEAN, defaultValue: false },
  });

  return {
    Negotiator,
    Property,
    Applicant,
    Offer,
    Appointment
  };
};
