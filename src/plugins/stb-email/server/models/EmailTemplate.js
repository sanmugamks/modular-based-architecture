'use strict';

/**
 * EmailTemplate Model
 */
module.exports = (sequelize, DataTypes) => {
  const EmailTemplate = sequelize.define('EmailTemplate', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    params: {
      type: DataTypes.JSON, // Stores documentation of required params
      allowNull: true,
    },
    to: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    cc: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return EmailTemplate;
};
