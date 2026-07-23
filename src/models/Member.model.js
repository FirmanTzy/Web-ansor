const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Member = sequelize.define(
    'Member',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      nama: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      jabatan: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      status_keanggotaan: {
        type: DataTypes.ENUM('Aktif', 'Alumni', 'Kehormatan'),
        allowNull: false,
        defaultValue: 'Aktif',
      },
    },
    {
      tableName: 'members',
      timestamps: true,
    }
  );

  return Member;
};

