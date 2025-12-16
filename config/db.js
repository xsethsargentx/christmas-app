// config/db.js
const mysql = require('mysql2/promise');
require('dotenv').config();

// Created a connection pool using environment variables
const pool = mysql.createPool({
  host: process.env.DB_HOST,        // e.g., 'localhost'
  user: process.env.DB_USER,        // e.g., 'root'
  password: process.env.DB_PASSWORD, // e.g., 'root'
  database: process.env.DB_NAME,     // e.g., 'christmas_media'
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;