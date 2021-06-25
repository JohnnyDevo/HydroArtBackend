const db = require('./');

module.exports = {
    create: async function(name, hash, credits_name, credits_url, contact_info) {
        try {
            const statement = `
                INSERT INTO users
                VALUES (DEFAULT, $1, $2, $3, $4, $5)
                RETURNING *;
            `
            const parameters = [name, hash, credits_name, credits_url, contact_info];

            const result = await db.query(statement, parameters);
            if (result.rows?.length) {
                return result.rows[0];
            } else {
                console.warn('user creation did not error, but did not return data');
                throw new Error();
            }
        } catch (error) {
            console.log('error when creating new user');
            throw error;
        }
    },

    findById: async function(id) {
        try {
            const statement = `
                SELECT username, password, credits_name, credits_url, contact_info
                FROM users
                WHERE id = $1;
            `
            const parameters = [id];

            const result = await db.query(statement, parameters);
            if (result.rows?.length) {
                return result.rows[0];
            } else {
                return null;
            }
        } catch (error) {
            console.log('error when querying user');
            throw error;
        }
    },

    updateById: async function(id, name, hash, credits_name, credits_url, contact_info) {
        try {
            const statement = `
                UPDATE TABLE users
                SET username = $2,
                    password = $3,
                    credits_name = $4,
                    credits_url = $5,
                    contact_info = $6
                WHERE id = $1
                RETURNING *;
            `
            const parameters = [id, name, hash, credits_name, credits_url, contact_info];

            const result = await db.query(statement, parameters);
            if (result.rows?.length) {
                return result.rows[0];
            } else {
                console.warn('user update did not error, but did not return data');
                throw new Error();
            }
        } catch (error) {
            console.log('error when updating user');
            throw error;
        }
    },

    deleteById: async function(id) {
        try {
            const statement = `
                DELETE FROM users
                WHERE id = $1
            `
            const parameters = [id];

            await db.query(statement, parameters);
        } catch (error) {
            console.log('error when deleting user');
            throw error;
        }
    }
}