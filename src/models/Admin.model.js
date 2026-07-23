const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Admin = sequelize.define(
    'Admin',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      resetPasswordToken: {
        type: DataTypes.STRING(255),
        allowNull: true,
        unique: true,
      },
      resetPasswordExpires: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      tableName: 'admins',
      timestamps: true,
    }
  );

  return Admin;
};

