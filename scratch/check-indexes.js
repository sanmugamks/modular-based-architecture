const { sequelize } = require('./src/models');

async function checkIndexes() {
  try {
    const [results] = await sequelize.query('SHOW INDEX FROM ApiRoles');
    console.log('Indexes on ApiRoles table:');
    results.forEach((idx) => {
      console.log(`- ${idx.Key_name} (${idx.Column_name})`);
    });
    console.log(`Total indexes: ${results.length}`);
  } catch (err) {
    console.error('Error checking indexes:', err);
  } finally {
    await sequelize.close();
  }
}

checkIndexes();
