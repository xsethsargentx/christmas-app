const DaoCommon = require('./daoCommon');

class DirectorDao extends DaoCommon {
  constructor() {
    super('director', 'director_id');
  }

  // Unique method 1: Sort by name ASC/DESC
  async sortByName(order = 'ASC') {
    const sql = `SELECT * FROM \`${this.table}\` ORDER BY name ${order === 'DESC' ? 'DESC' : 'ASC'}`;
    const [rows] = await this.db.execute(sql);
    return rows;
  }

  // Unique method 2: Sort by number of programs directed (most → least)
async sortByProgramCount(order = 'DESC') {
  // Make sure order is either ASC or DESC to avoid SQL injection
  order = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  const sql = `
    SELECT 
      d.director_id, 
      d.name, 
      COUNT(pd.program_id) AS program_count
    FROM director d
    LEFT JOIN program_director pd ON d.director_id = pd.director_id
    GROUP BY d.director_id, d.name
    ORDER BY program_count ${order}, d.name ASC
  `;
  const [rows] = await this.db.execute(sql);
  return rows;
}
}

module.exports = new DirectorDao();