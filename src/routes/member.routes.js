const express = require('express');
const router = express.Router();

const { getMembers, createMember } = require('../controllers/member.controller');
const { requireAdmin } = require('../middleware/auth.middleware');

// GET /api/members (Public/Admin)
router.get('/', getMembers);

// POST /api/members (Protected - Admin only)
router.post('/', requireAdmin, createMember);

module.exports = router;

