require('dotenv').config();
const { sequelize, DataTypes, associateModels } = require('../models');
const argon2 = require('argon2');

// Import plugin models directly for seeding
const authModelsFactory = require('../plugins/stb-auth/server/models');
const myaccountModelsFactory = require('../plugins/stb-myaccount/server/models');
const mypluginModelsObj = require('../plugins/my-plugin/server/models'); // This one is an object of factories
const emailModelsFactory = require('../plugins/stb-email/server/models/EmailTemplate');

async function seed() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();

    // Initialize plugin models for seeding context
    const authModels = authModelsFactory(sequelize, DataTypes);
    const myaccountModels = myaccountModelsFactory(sequelize, DataTypes);

    // Handle the object-of-factories pattern in my-plugin
    const mypluginModels = {};
    for (const [name, factory] of Object.entries(mypluginModelsObj)) {
      mypluginModels[name] = factory(sequelize, DataTypes);
    }

    const EmailTemplate = emailModelsFactory(sequelize, DataTypes);

    const allModels = {
      ...authModels,
      ...myaccountModels,
      ...mypluginModels,
      EmailTemplate,
    };

    // Run late-binding associations
    associateModels(allModels);

    console.log('Syncing models (Force)...');
    // Disable FK checks for the drop/create phase
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await sequelize.sync({ force: true });
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');

    const { AdminUser, AdminRole, AdminPermission } = authModels;

    console.log('Creating Admin Role...');
    const adminRole = await AdminRole.create({ name: 'SuperAdmin' });

    console.log('Creating All Permissions...');
    await AdminPermission.create({
      action: 'ALL',
      endpoint: '/admin/*',
      AdminRoleId: adminRole.id,
    });

    console.log('Creating Root User...');
    const hashedPassword = await argon2.hash('admin123');
    await AdminUser.create({
      email: 'admin@starberry.tv',
      password: hashedPassword,
      AdminRoleId: adminRole.id,
    });

    console.log('Seeding Email Templates...');
    await EmailTemplate.create({
      name: 'Welcome Email',
      slug: 'welcome-email',
      subject: 'Welcome to MyAccount!',
      body: 'Hello!\n\nYour account has been successfully created for email: <%= email %>.\n\nBest regards,\nThe Team',
      params: { email: 'User email address' },
    });

    await EmailTemplate.create({
      name: 'Account Update Notification',
      slug: 'account-update',
      subject: 'Account Details Updated',
      body: 'Hello,\n\nThis is a confirmation that your account details were recently updated for <%= email %>.',
      params: { email: 'User email address' },
    });

    console.log('\nSeeding complete! Admin account created and email templates initialized.');
    console.log('Email: admin@starberry.tv');
    console.log('Password: admin123\n');
  } catch (error) {
    console.error('Seeding blocked due to error:', error);
  } finally {
    process.exit();
  }
}

seed();
