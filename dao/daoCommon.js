// dao/daoCommon.js
const db = require('../config/db');

class DaoCommon {
  /**
   * @param {string} tableName - name of the table
   * @param {string} primaryKey - primary key column name, default: `${tableName}_id`
   */
  constructor(tableName, primaryKey = null) {
    this.table = tableName;
    this.pk = primaryKey || `${tableName.toLowerCase()}_id`;
    this.db = db;
  }


  // Fetch all rows
  async findAll() {
    const sql = `SELECT * FROM \`${this.table}\``;
    const [rows] = await this.db.execute(sql);
    return rows;
  }

  // Fetch single row by ID
  async findById(id) {
    const sql = `SELECT * FROM \`${this.table}\` WHERE \`${this.pk}\` = ? LIMIT 1`;
    const [rows] = await this.db.execute(sql, [id]);
    return rows[0] || null;
  }

  // Count all rows
  async countAll() {
    const sql = `SELECT COUNT(*) AS cnt FROM \`${this.table}\``;
    const [rows] = await this.db.execute(sql);
    return rows[0]?.cnt || 0;
  }

  // Generic search
async search(cols, query) {
    const sql = `SELECT * FROM \`${this.table}\` WHERE ${cols.map(c => `\`${c}\` LIKE ?`).join(' OR ')}`;
    const params = Array(cols.length).fill(`%${query}%`);
    const [rows] = await this.db.execute(sql, params);
    return rows;
}

  // Sort rows by column and direction
  async sort(column = this.pk, direction = 'ASC') {
    const dir = direction.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
    const sql = `SELECT * FROM \`${this.table}\` ORDER BY \`${column}\` ${dir}`;
    const [rows] = await this.db.execute(sql);
    return rows;
  }

  // Insert a new row
  async create(data = {}) {
    const keys = Object.keys(data);
    if (!keys.length) throw new Error('No data provided to create()');
    const cols = keys.map(k => `\`${k}\``).join(', ');
    const placeholders = keys.map(() => '?').join(', ');
    const params = keys.map(k => data[k]);
    const sql = `INSERT INTO \`${this.table}\` (${cols}) VALUES (${placeholders})`;
    const [result] = await this.db.execute(sql, params);
    return result.insertId;
  }

  // Update a row by ID
  async update(id, data = {}) {
    const keys = Object.keys(data);
    if (!keys.length) throw new Error('No data provided to update()');
    const assignments = keys.map(k => `\`${k}\` = ?`).join(', ');
    const params = keys.map(k => data[k]);
    params.push(id);
    const sql = `UPDATE \`${this.table}\` SET ${assignments} WHERE \`${this.pk}\` = ?`;
    const [result] = await this.db.execute(sql, params);
    return result.affectedRows;
  }

  // Delete a row by ID
  async delete(id) {
    const sql = `DELETE FROM \`${this.table}\` WHERE \`${this.pk}\` = ?`;
    const [result] = await this.db.execute(sql, [id]);
    return result.affectedRows;
  }
}

module.exports = DaoCommon;