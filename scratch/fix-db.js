const mysql = require('mysql2/promise');
require('dotenv').config();

async function fixApiRoles() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });

  try {
    const [indexes] = await connection.query(
      'SHOW INDEX FROM ApiRoles WHERE Key_name != "PRIMARY"'
    );
    console.log(`Found ${indexes.length} indexes to potentially remove.`);

    for (const idx of indexes) {
      if (idx.Key_name !== 'PRIMARY') {
        console.log(`Dropping index: ${idx.Key_name}`);
        try {
          await connection.query(`ALTER TABLE ApiRoles DROP INDEX \`${idx.Key_name}\``);
        } catch (e) {
          console.error(`Failed to drop ${idx.Key_name}: ${e.message}`);
        }
      }
    }
    console.log('Finished dropping extra indexes.');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await connection.end();
  }
}

fixApiRoles();
