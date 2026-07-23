const jwt = require('jsonwebtoken');
const { Admin } = require('../models');

async function requireAdmin(req, res, next) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing Bearer token' });
    }

    const token = header.split(' ')[1];
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findByPk(payload.sub);
    if (!admin) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.admin = {
      id: admin.id,
      username: admin.username,
    };

    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
}

module.exports = {
  requireAdmin,
};

