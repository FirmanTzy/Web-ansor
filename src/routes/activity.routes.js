const express = require('express');
const router = express.Router();

const { getActivities } = require('../controllers/activity.controller');

// GET /api/activities (Public)
router.get('/', getActivities);

module.exports = router;

