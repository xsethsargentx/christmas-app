// dao/actorDao.js
const DaoCommon = require('./daoCommon');

class ActorDao extends DaoCommon {
  constructor() {
    super('actor', 'actor_id');
  }

  // Unique method 1: sort by name
  async findAllByName(order = 'ASC') {
    const sql = `SELECT * FROM \`${this.table}\` ORDER BY \`name\` ${order === 'DESC' ? 'DESC' : 'ASC'}`;
    const [rows] = await this.db.execute(sql);
    return rows;
  }

  // Unique method 2: sort by birthdate
  async findAllByBirthdate(order = 'ASC') {
    const sql = `SELECT * FROM \`${this.table}\` ORDER BY \`birthdate\` ${order === 'DESC' ? 'DESC' : 'ASC'}`;
    const [rows] = await this.db.execute(sql);
    return rows;
  }

  // Default methods
  async create({ name, birthdate, bio }) {
    const sql = `
      INSERT INTO \`${this.table}\` (name, birthdate, bio)
      VALUES (?, ?, ?)
    `;
    const [result] = await this.db.execute(sql, [name, birthdate || null, bio || null]);
    return result.insertId;
  }
}

module.exports = new ActorDao();