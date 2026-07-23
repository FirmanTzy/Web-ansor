const { Activity } = require('../models');

async function getActivities(req, res) {
  const activities = await Activity.findAll({ order: [['tanggal_pelaksanaan', 'ASC'], ['id', 'DESC']] });
  return res.json(activities);
}

module.exports = {
  getActivities,
};

