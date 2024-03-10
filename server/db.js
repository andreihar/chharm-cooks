const { Pool } = require('pg')
const bcrypt = require('bcryptjs')
const saltRounds = 10

require('dotenv').config({ path: './process.env' })
const pool = new Pool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
	port: process.env.DB_PORT
});

const defaultData = async function() {
    const fs = require('fs')
    const users = JSON.parse(fs.readFileSync('./assets/defaultUsers.json', 'utf8'))
    const recipes = JSON.parse(fs.readFileSync('./assets/defaultRecipes.json', 'utf8'))
    for (const { username, password, picture, social } of users) {
        await helpers.addUser(username, password, picture, social)
    }
    for (const { title, chinTitle, cuisine, username, prepTime, cookTime, servings, picture, ingredients, recipeInstructions } of recipes) {
        await helpers.addRecipe(title, chinTitle, cuisine, username, prepTime, cookTime, servings, picture, new Date(), new Date(), ingredients, recipeInstructions)
    }
};

const helpers = {
    init: async function() {
        const sql = `
            CREATE TABLE IF NOT EXISTS users(
                username VARCHAR(50) PRIMARY KEY, 
                password VARCHAR(60), 
                picture TEXT, 
                social TEXT
            );
            CREATE TABLE IF NOT EXISTS ingredient(
                iid SERIAL PRIMARY KEY, 
                ingredients TEXT[]
            );
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
                created_on TIMESTAMPTZ, 
                time_last_modified TIMESTAMPTZ, 
                iid INT,
                FOREIGN KEY (iid) REFERENCES ingredient(iid) ON DELETE CASCADE,
                recipe_instructions TEXT[]
            );
        `
        await pool.query(sql);
        if (!(await pool.query("SELECT EXISTS (SELECT 1 FROM recipe LIMIT 1);")).rows[0].exists)
            await defaultData()
    },

    // Users
    getUsers: async function() {
        const res = await pool.query('SELECT username, picture, social FROM users')
        return res.rows
    },

    getUserByName: async function(username) {
        const res = await pool.query('SELECT username, picture, social FROM users WHERE username = $1', [username])
        return res.rows[0]
    },

	addUser: async function(username, password, picture, social) {
        const hashedPassword = bcrypt.hashSync(password, saltRounds);
        const q = 'INSERT INTO users(username, password, picture, social) VALUES($1, $2, $3, $4) ON CONFLICT (username) DO NOTHING'
        const res = await pool.query(q, [username, hashedPassword, picture, social])
    },

    addUser: async function(username, password, picture, social) {
        const hashedPassword = bcrypt.hashSync(password, saltRounds);
        const q = 'INSERT INTO users(username, password, picture, social) VALUES($1, $2, $3, $4) ON CONFLICT (username) DO NOTHING RETURNING *';
        const res = await pool.query(q, [username, hashedPassword, picture, social]);
        return res.rows[0];
    },

    checkPassword: async function(username, password) {
        const q = 'SELECT password FROM users WHERE username = $1'
        const res = await pool.query(q, [username])
        const user = res.rows[0]
        return user && bcrypt.compareSync(password, user.password)
    },

    // Recipes
    getRecipes: async function() {
        const res = await pool.query(`
            SELECT recipe.*, ingredient.*
            FROM recipe
            INNER JOIN ingredient
            ON recipe.iid = ingredient.iid
        `);
        return res.rows
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
        await pool.query('BEGIN')
        try {
            const ingredientRes = await pool.query('INSERT INTO ingredient(ingredients) VALUES($1) RETURNING iid', [ingredients])
            const iid = ingredientRes.rows[0].iid
            await pool.query('INSERT INTO recipe(title, chin_title, cuisine, username, prep_time, cook_time, servings, picture, created_on, time_last_modified, iid, recipe_instructions) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)', [title, chin_title, cuisine, username, prep_time, cook_time, servings, picture, created_on, time_last_modified, iid, recipe_instructions])
            await pool.query('COMMIT')
        } catch (e) {
            await pool.query('ROLLBACK')
            throw e
        }
    },

    deleteById: async function(id) {
        const q = 'DELETE FROM recipe WHERE rid = $1'
        const res = await pool.query(q, [id])
    },

    updateById: async function(id, title, chin_title, cuisine, username, prep_time, cook_time, servings, picture, created_on, time_last_modified, ingredients, recipe_instructions) {
        await pool.query('BEGIN')
        try {
            const recipeRes = await pool.query('SELECT iid FROM recipe WHERE rid = $1', [id])
            const iid = recipeRes.rows[0].iid
            await pool.query('UPDATE ingredient SET ingredients = $1 WHERE iid = $2', [ingredients, iid])
            await pool.query('UPDATE recipe SET title = $1, chin_title = $2, cuisine = $3, username = $4, prep_time = $5, cook_time = $6, servings = $7, picture = $8, created_on = $9, time_last_modified = $10, recipe_instructions = $11 WHERE rid = $12', [title, chin_title, cuisine, username, prep_time, cook_time, servings, picture, created_on, time_last_modified, recipe_instructions, id])
            await pool.query('COMMIT')
        } catch (e) {
            await pool.query('ROLLBACK')
            throw e
        }
    }
}

module.exports = { helpers }