const bcrypt = require('bcrypt');
const { Admin, sequelize } = require('../models');

async function seed() {
  const username = process.env.ADMIN_USERNAME || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin12345';

  const hash = await bcrypt.hash(password, 10);

  const [admin, created] = await Admin.findOrCreate({
    where: { username },
    defaults: { password: hash },
  });

  if (created) {
    // eslint-disable-next-line no-console
    console.log(`Seeded admin: ${username}`);
  } else {
    // eslint-disable-next-line no-console
    console.log(`Admin already exists: ${username}`);
  }

  await sequelize.close();
}

seed().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});

