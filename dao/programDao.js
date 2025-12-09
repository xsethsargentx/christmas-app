const DaoCommon = require('./daoCommon');

class ProgramDao {
    constructor() {
        this.common = new DaoCommon('program');
    }

    // =========================
    // BASIC CRUD
    // =========================

    findAll() {
        return this.common.findAll();
    }

    findById(id) {
        return this.common.findById(id);
    }

    createProgram(data) {
        return this.common.create(data);
    }

    updateProgram(id, data) {
        return this.common.update(id, data);
    }

    deleteProgram(id) {
        return this.common.delete(id);
    }

    countAll() {
        return this.common.countAll();
    }

    // =========================
    // CUSTOM METHODS
    // =========================

    async findByRating(rating) {
        const sql = `SELECT * FROM program WHERE program_rating = ?`;
        const [rows] = await this.common.db.execute(sql, [rating]);
        return rows;
    }

    async sortByYear(order = "ASC") {
        const sql = `SELECT * FROM program ORDER BY Yr_released ${order}`;
        const [rows] = await this.common.db.execute(sql);
        return rows;
    }

    // Fetch one program WITH director(s) and producer(s)
    async findByIdWithCredits(id) {
        const sql = `
            SELECT 
                p.*,
                GROUP_CONCAT(DISTINCT d.name SEPARATOR ', ') AS directors,
                GROUP_CONCAT(DISTINCT pr.name SEPARATOR ', ') AS producers
            FROM program p
            LEFT JOIN program_director pd ON p.program_id = pd.program_id
            LEFT JOIN director d ON pd.director_id = d.director_id
            LEFT JOIN program_producer pp ON p.program_id = pp.program_id
            LEFT JOIN producer pr ON pp.producer_id = pr.producer_id
            WHERE p.program_id = ?
            GROUP BY p.program_id;
        `;
        const [rows] = await this.common.db.execute(sql, [id]);
        return rows[0] || null;
    }
}

module.exports = new ProgramDao();