const { sequelize, DataTypes } = require('../config/database');

// --- API Users (Frontend) ---
const ApiRole = sequelize.define('ApiRole', {
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  description: DataTypes.STRING
});

const ApiPermission = sequelize.define('ApiPermission', {
  action: { type: DataTypes.STRING, allowNull: false },
  endpoint: { type: DataTypes.STRING, allowNull: false },
});

const ApiUser = sequelize.define('ApiUser', {
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false }, // Hashed with Argon2
  contact_id: DataTypes.STRING,
  company_id: DataTypes.STRING
});

// Relationships
ApiRole.hasMany(ApiPermission);
ApiPermission.belongsTo(ApiRole);
ApiRole.hasMany(ApiUser);
ApiUser.belongsTo(ApiRole);

// --- Admin Users (Dashboard) ---
const AdminRole = sequelize.define('AdminRole', {
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  description: DataTypes.STRING
});

const AdminPermission = sequelize.define('AdminPermission', {
  action: { type: DataTypes.STRING, allowNull: false },
  endpoint: { type: DataTypes.STRING, allowNull: false },
});

const AdminUser = sequelize.define('AdminUser', {
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false }
});

// Relationships
AdminRole.hasMany(AdminPermission);
AdminPermission.belongsTo(AdminRole);
AdminRole.hasMany(AdminUser);
AdminUser.belongsTo(AdminRole);

// --- CRM Entities ---
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

// --- Applicant (Buyer/Tenant linked to a user account) ---
const Applicant = sequelize.define('Applicant', {
  crm_id: { type: DataTypes.STRING },
  marketing_mode: { type: DataTypes.STRING, defaultValue: 'buying' }, // 'buying' or 'letting'
  status: { type: DataTypes.STRING, defaultValue: 'active' },
});

// --- Offer (A bid on a Property) ---
const Offer = sequelize.define('Offer', {
  crm_id: { type: DataTypes.STRING },
  amount: { type: DataTypes.FLOAT, allowNull: false },
  status: { type: DataTypes.STRING, defaultValue: 'pending' }, // pending, accepted, rejected, withdrawn
  date: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});

// --- Appointment (Viewing / Valuation) ---
const Appointment = sequelize.define('Appointment', {
  crm_id: { type: DataTypes.STRING },
  appointment_type: { type: DataTypes.STRING, defaultValue: 'VW' }, // VW = Viewing, VL = Valuation
  appointment_starttime: { type: DataTypes.DATE, allowNull: false },
  appointment_endtime: { type: DataTypes.DATE },
  cancelled: { type: DataTypes.BOOLEAN, defaultValue: false },
  confirmed: { type: DataTypes.BOOLEAN, defaultValue: false },
});

// ============================
// Relationships
// ============================

// Negotiator <-> Property (One-To-Many)
Negotiator.hasMany(Property, { foreignKey: 'NegotiatorId' });
Property.belongsTo(Negotiator, { foreignKey: 'NegotiatorId' });

// ApiUser <-> Applicant (One-To-Many: a user can be an applicant in multiple modes)
ApiUser.hasMany(Applicant, { foreignKey: 'ApiUserId' });
Applicant.belongsTo(ApiUser, { foreignKey: 'ApiUserId' });

// Property <-> Offer (One-To-Many: a property receives many offers)
Property.hasMany(Offer, { foreignKey: 'PropertyId' });
Offer.belongsTo(Property, { foreignKey: 'PropertyId' });

// Applicant <-> Offer (One-To-Many: an applicant makes many offers)
Applicant.hasMany(Offer, { foreignKey: 'ApplicantId' });
Offer.belongsTo(Applicant, { foreignKey: 'ApplicantId' });

// Negotiator <-> Offer (One-To-Many: a negotiator handles many offers)
Negotiator.hasMany(Offer, { foreignKey: 'NegotiatorId' });
Offer.belongsTo(Negotiator, { foreignKey: 'NegotiatorId' });

// Property <-> Appointment (One-To-Many: a property has many viewings)
Property.hasMany(Appointment, { foreignKey: 'PropertyId' });
Appointment.belongsTo(Property, { foreignKey: 'PropertyId' });

// Applicant <-> Appointment (One-To-Many: an applicant books many viewings)
Applicant.hasMany(Appointment, { foreignKey: 'ApplicantId' });
Appointment.belongsTo(Applicant, { foreignKey: 'ApplicantId' });

// Negotiator <-> Appointment (One-To-Many: a negotiator conducts many viewings)
Negotiator.hasMany(Appointment, { foreignKey: 'NegotiatorId' });
Appointment.belongsTo(Negotiator, { foreignKey: 'NegotiatorId' });


module.exports = {
  sequelize,
  ApiUser, ApiRole, ApiPermission,
  AdminUser, AdminRole, AdminPermission,
  Negotiator, Property, Applicant, Offer, Appointment
};
