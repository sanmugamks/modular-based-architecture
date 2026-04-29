'use strict';

/**
 * Models for stb-auth plugin (Identity & Access Management)
 */
module.exports = (sequelize, DataTypes) => {
  // --- API Users (Frontend) ---
  const ApiRole = sequelize.define('ApiRole', {
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: DataTypes.STRING,
  });

  const ApiPermission = sequelize.define('ApiPermission', {
    action: { type: DataTypes.STRING, allowNull: false },
    endpoint: { type: DataTypes.STRING, allowNull: false },
  });

  const ApiUser = sequelize.define('ApiUser', {
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false, hidden: true }, // Hashed with Argon2
    contact_id: DataTypes.STRING,
    company_id: DataTypes.STRING,
  });

  // --- Admin Users (Dashboard) ---
  const AdminRole = sequelize.define('AdminRole', {
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: DataTypes.STRING,
  });

  const AdminPermission = sequelize.define('AdminPermission', {
    action: { type: DataTypes.STRING, allowNull: false },
    endpoint: { type: DataTypes.STRING, allowNull: false },
  });

  const AdminUser = sequelize.define('AdminUser', {
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false, hidden: true },
  });

  // ============================
  // Relationships
  // ============================

  // API Identity
  ApiRole.hasMany(ApiPermission);
  ApiPermission.belongsTo(ApiRole);
  ApiRole.hasMany(ApiUser);
  ApiUser.belongsTo(ApiRole);

  // Admin Identity
  AdminRole.hasMany(AdminPermission);
  AdminPermission.belongsTo(AdminRole);
  AdminRole.hasMany(AdminUser);
  AdminUser.belongsTo(AdminRole);

  return {
    ApiUser,
    ApiRole,
    ApiPermission,
    AdminUser,
    AdminRole,
    AdminPermission,
  };
};
