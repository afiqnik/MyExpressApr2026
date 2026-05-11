const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a connection pool
const database = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

// Test the connection
(async () => {
    try {
        const connection = await database.getConnection();
        console.log('Connected to MySQL database!');
        connection.release();
    } catch (err) {
        console.error('Database connection error:', err.message);
    }
})();

module.exports = database;