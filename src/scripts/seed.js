require('dotenv').config();
const { sequelize, AdminUser, AdminRole, AdminPermission } = require('../models');
const argon2 = require('argon2');

async function seed() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    
    console.log('Syncing models...');
    await sequelize.sync({ force: true }); // WARNING: This drops tables

    console.log('Creating Admin Role...');
    const adminRole = await AdminRole.create({ name: 'SuperAdmin' });

    console.log('Creating All Permissions...');
    await AdminPermission.create({ 
      action: 'ALL', endpoint: '/admin/*', AdminRoleId: adminRole.id 
    });

    console.log('Creating Root User...');
    const hashedPassword = await argon2.hash('admin123');
    await AdminUser.create({
      email: 'admin@starberry.tv',
      password: hashedPassword,
      AdminRoleId: adminRole.id
    });

    console.log('\nSeeding complete! You can now log into AdminJS with:');
    console.log('Email: admin@starberry.tv');
    console.log('Password: admin123\n');
  } catch(error) {
    console.error('Seeding blocked due to error:', error);
  } finally {
    process.exit();
  }
}

seed();
