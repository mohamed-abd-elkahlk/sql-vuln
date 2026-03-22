const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'vulndb',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

const User = {
  // VULNERABLE: Direct string concatenation
  findVulnerable: async (username, password) => {
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    const result = await pool.query(query);
    return result.rows[0];
  },

  // SECURE: Parameterized query
  findSecure: async (username, password) => {
    const query = 'SELECT * FROM users WHERE username = $1 AND password = $2';
    const values = [username, password];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  findById: async (id) => {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    return result.rows[0];
  },

  create: async (username, password, role = 'user') => {
    const query = 'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING *';
    const values = [username, password, role];
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // VULNERABLE: Direct string concatenation allows SQL Injection during registration
  createVulnerable: async (username, password, role = 'user') => {
    const query = `INSERT INTO users (username, password, role) VALUES ('${username}', '${password}', '${role}') RETURNING *`;
    const result = await pool.query(query);
    return result.rows[0];
  }
};

module.exports = User;
