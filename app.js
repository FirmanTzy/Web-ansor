require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { sequelize } = require('./src/models');
const { notFoundHandler, errorHandler } = require('./src/middleware/errorHandlers');

// Routes
const authRoutes = require('./src/routes/auth.routes');
const memberRoutes = require('./src/routes/member.routes');
const activityRoutes = require('./src/routes/activity.routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(__dirname));

app.get('/health', (req, res) => res.json({ ok: true }));

app.use('/api/admin', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/activities', activityRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

(async () => {
  try {
    await sequelize.authenticate();
    // sync is for demo/dev; in production prefer migrations
    await sequelize.sync({ alter: true });
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server:', err);
    process.exit(1);
  }
})();

