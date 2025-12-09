const DaoCommon = require('./daoCommon');

class PlatformDao extends DaoCommon {
  constructor() {
    super('streaming_platform'); // table name
  }

  // Unique method 1: Sort alphabetically
  async sortByName(order = 'ASC') {
    const sql = `SELECT * FROM streaming_platform ORDER BY name ${order}`;
    const [rows] = await this.db.execute(sql);
    return rows;
  }

  // Unique method 2: Sort by number of programs (most → least)
  async sortByProgramCount() {
  const sql = `
    SELECT 
      sp.platform_id,
      sp.name,
      sp.platform_url,
      COUNT(pp.program_id) AS program_count
    FROM streaming_platform sp
    LEFT JOIN Program_Platform pp ON sp.platform_id = pp.platform_id
    GROUP BY sp.platform_id, sp.name, sp.platform_url
    ORDER BY program_count DESC, sp.name ASC
  `;
  const [rows] = await this.db.execute(sql);
  return rows;
}

  async findByName(name) {
    const sql = 'SELECT * FROM streaming_platform WHERE name LIKE ?';
    const [rows] = await this.db.execute(sql, [`%${name}%`]);
    return rows;
  }

  async findByProgram(programId) {
    const sql = `
      SELECT sp.* FROM streaming_platform sp
      JOIN Program_Streaming ps ON sp.platform_id = ps.platform_id
      WHERE ps.program_id = ?
    `;
    const [rows] = await this.db.execute(sql, [programId]);
    return rows;
  }

  async findById(id) {
    const sql = 'SELECT * FROM streaming_platform WHERE platform_id = ? LIMIT 1';
    const [rows] = await this.db.execute(sql, [id]);
    return rows[0] || null;
  }
}

module.exports = new PlatformDao();