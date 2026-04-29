module.exports = (sequelize, DataTypes) => {
  return sequelize.define('PluginNote', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
    },
    tags: {
      type: DataTypes.STRING,
    }, // comma-separated tags
  });
};
