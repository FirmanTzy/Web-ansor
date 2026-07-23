const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Activity = sequelize.define(
    'Activity',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      judul_kegiatan: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      tanggal_pelaksanaan: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      lokasi: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      tableName: 'activities',
      timestamps: true,
    }
  );

  return Activity;
};

