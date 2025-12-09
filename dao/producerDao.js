const DaoCommon = require('./daoCommon');

class ProducerDao extends DaoCommon {
  constructor() {
    super('producer'); // table name
  }

  // Unique method 1: Sort alphabetically
  async sortByName(order = 'ASC') {
    const sql = `SELECT * FROM \`${this.table}\` ORDER BY name ${order}`;
    const [rows] = await this.db.execute(sql);
    return rows;
  }

  // Unique method 2: Filter by country
  async findByCountry(country) {
    const sql = `SELECT * FROM \`${this.table}\` WHERE country = ? ORDER BY name ASC`;
    const [rows] = await this.db.execute(sql, [country]);
    return rows;
  }
}

module.exports = new ProducerDao();