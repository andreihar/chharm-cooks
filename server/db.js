const { Pool } = require('pg');

require('dotenv').config({ path: './process.env' });
const pool = new Pool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
	port: process.env.DB_PORT
});

const helpers = {
    init: async function(users, recipes) {
        const usersSql = `
            CREATE TABLE IF NOT EXISTS users(
                username VARCHAR(50) PRIMARY KEY, 
                password VARCHAR(50), 
                picture TEXT, 
                social TEXT
            );
        `;
        // Default data
        const resUser = await pool.query(usersSql);
        if (resUser.command === 'CREATE') {
            for (const user of users) {
                const { username, password, picture, social } = user;
                await helpers.addUser(username, password, picture, social);
            }
        }
        await pool.query(`CREATE TABLE IF NOT EXISTS ingredient(
            iid SERIAL PRIMARY KEY, 
            ingredients TEXT[]
        );`);
        const recipesSql = `
            CREATE TABLE IF NOT EXISTS recipe(
                rid SERIAL PRIMARY KEY, 
                title VARCHAR(50), 
                chin_title VARCHAR(50), 
                cuisine VARCHAR(50), 
                username VARCHAR(50), 
                FOREIGN KEY (username) REFERENCES users(username), 
                prep_time INT, 
                cook_time INT, 
                servings INT, 
                picture TEXT, 
                created_on TIMESTAMP, 
                time_last_modified TIMESTAMP, 
                iid INT,
                FOREIGN KEY (iid) REFERENCES ingredient(iid) ON DELETE CASCADE,
                recipe_instructions TEXT[]
            );
        `;
        // Default data
        const resRec = await pool.query(recipesSql);
        if (resRec.command === 'CREATE') {
            for (const recipe of recipes) {
                const { title, chinTitle, cuisine, username, prepTime, cookTime, servings, picture, ingredients, recipeInstructions } = recipe;
                await helpers.addRecipe(title, chinTitle, cuisine, username, prepTime, cookTime, servings, picture, new Date(), new Date(), ingredients, recipeInstructions);
            }
        }
    },

    // Users
    getUsers: async function() {
        const res = await pool.query('SELECT * FROM users')
        return res.rows
    },

    getUserByName: async function(username) {
        const res = await pool.query('SELECT * FROM users WHERE username = $1', [username])
        return res.rows[0]
    },

	addUser: async function(username, password, picture, social) {
        const q = 'INSERT INTO users(username, password, picture, social) VALUES($1, $2, $3, $4) ON CONFLICT (username) DO NOTHING'
        const res = await pool.query(q, [username, password, picture, social])
    },

    // Recipes
    getRecipes: async function() {
        const res = await pool.query(`
            SELECT recipe.*, ingredient.*
            FROM recipe
            INNER JOIN ingredient
            ON recipe.iid = ingredient.iid
        `);
        return res.rows;
    },

    getRecipeById: async function(id) {
        const res = await pool.query(`
            SELECT recipe.*, ingredient.*
            FROM recipe
            INNER JOIN ingredient
            ON recipe.iid = ingredient.iid
            WHERE rid = $1
        `, [id])
        return res.rows[0]
    },

    addRecipe: async function(title, chin_title, cuisine, username, prep_time, cook_time, servings, picture, created_on, time_last_modified, ingredients, recipe_instructions) {
        await pool.query('BEGIN');
        try {
            const ingredientRes = await pool.query('INSERT INTO ingredient(ingredients) VALUES($1) RETURNING iid', [ingredients]);
            const iid = ingredientRes.rows[0].iid;
            await pool.query('INSERT INTO recipe(title, chin_title, cuisine, username, prep_time, cook_time, servings, picture, created_on, time_last_modified, iid, recipe_instructions) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)', [title, chin_title, cuisine, username, prep_time, cook_time, servings, picture, created_on, time_last_modified, iid, recipe_instructions]);
            await pool.query('COMMIT');
        } catch (e) {
            await pool.query('ROLLBACK');
            throw e;
        }
    },

    deleteById: async function(id) {
        const q = 'DELETE FROM recipe WHERE rid = $1'
        const res = await pool.query(q, [id])
    },

    updateById: async function(id, title, chin_title, cuisine, username, prep_time, cook_time, servings, picture, created_on, time_last_modified, ingredients, recipe_instructions) {
        await pool.query('BEGIN');
        try {
            const recipeRes = await pool.query('SELECT iid FROM recipe WHERE rid = $1', [id]);
            const iid = recipeRes.rows[0].iid;
            await pool.query('UPDATE ingredient SET ingredients = $1 WHERE iid = $2', [ingredients, iid]);
            await pool.query('UPDATE recipe SET title = $1, chin_title = $2, cuisine = $3, username = $4, prep_time = $5, cook_time = $6, servings = $7, picture = $8, created_on = $9, time_last_modified = $10, recipe_instructions = $11 WHERE rid = $12', [title, chin_title, cuisine, username, prep_time, cook_time, servings, picture, created_on, time_last_modified, recipe_instructions, id]);
            await pool.query('COMMIT');
        } catch (e) {
            await pool.query('ROLLBACK');
            throw e;
        }
    }
}

module.exports = { helpers }