const { Pool } = require('pg');

const pool = new Pool();

module.exports = {
    pool: pool,
    query: async (text, params) => {
        const client = await pool.connect();
        let res;
        try {
            await client.query('BEGIN');
            try {
                res = await client.query(text, params);
                await client.query('COMMIT');
            } catch (err) {
                await client.query('ROLLBACK');
                throw err;
            }
        } finally {
            client.release();
        }
        return res;
    }
}
