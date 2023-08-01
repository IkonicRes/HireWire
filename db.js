const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config();

async function executeSqlFile(filePath, connection) {
  const sql = fs.readFileSync(filePath, 'utf-8');
  await connection.query(sql);
}

async function setupDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      multipleStatements: true, // Allow multiple SQL statements in one query
    });

    console.log('Creating the hirewire_db...');
    await connection.query('CREATE DATABASE IF NOT EXISTS hirewire_db');

    console.log('Switching to hirewire_db...');
    await connection.query('USE hirewire_db');

    console.log('Executing schema.sql...');
    await executeSqlFile('./db/schema.sql', connection);

    console.log('Executing seed.sql...');
    await executeSqlFile('./db/seed.sql', connection);

    console.log('Database setup completed successfully.');
    connection.end();
  } catch (error) {
    console.error('Error setting up the database:', error.message);
  }
}

setupDatabase();

// Function to retrieve employees from the database
async function getThingFromDatabase(thing) {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

  try {
    const [rows] = await connection.execute(`SELECT * FROM ${thing}`);
    return rows;
  } catch (error) {
    console.error(`Error fetching ${thing}:`, error);
    return [];
  } finally {
    connection.close();
  }
}

async function updateDatabase(stuff, task){
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    var [rows, fields] = null
    console.log(stuff) 
    switch (task) {
      case 'roles':
        [rows, fields] = await connection.execute("INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?);", [stuff.roleName, stuff.salary, stuff.departmentId])
        break;
      case 'departments':
        [rows, fields] = await connection.execute("INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?);", [stuff.roleName, stuff.salary, stuff.departmentId])
        break;
      default:
        break;
    }
  } catch (error) {
    console.error(error)
  }
  

}

module.exports = {
  getThingFromDatabase, updateDatabase
};