const { Sequelize } = require('sequelize');

const {
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USER,
  DB_PASS,
} = process.env;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT ? Number(DB_PORT) : undefined,
  dialect: 'postgres',
  logging: false,
});

const Admin = require('./Admin.model')(sequelize);
const Member = require('./Member.model')(sequelize);
const Activity = require('./Activity.model')(sequelize);

// Associations (if needed later)
// Admin has no relations currently.

module.exports = {
  sequelize,
  Admin,
  Member,
  Activity,
};

