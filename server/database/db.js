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
    for (const { username, email, picture, social, first_name, last_name, bio, occupation, password } of users) {
        await helpers.addUser(username, email, picture, social, first_name, last_name, bio, occupation, password)
    }
    for (const { title, chinTitle, cuisine, username, prepTime, cookTime, servings, picture, ingredients, recipeInstructions } of recipes) {
        await helpers.addRecipe(title, chinTitle, cuisine, username, prepTime, cookTime, servings, picture, new Date(), new Date(), ingredients, recipeInstructions)
    }
};

const helpers = {
    init: async function() {
        const {
            createUsersTable,
            createIngredientTable,
            createRecipeTable,
            createFollowersTable,
            createLikesTable,
            createNotificationsTable
        } = require('./tables')

        await pool.query(createUsersTable)
        await pool.query(createIngredientTable)
        await pool.query(createRecipeTable)
        await pool.query(createFollowersTable)
        await pool.query(createLikesTable)
        await pool.query(createNotificationsTable)
        if (!(await pool.query("SELECT EXISTS (SELECT 1 FROM recipe LIMIT 1);")).rows[0].exists)
            await defaultData()
    },

    // Users
    getUsers: async function() {
        const res = await pool.query('SELECT username, email, picture, social, first_name, last_name, bio, occupation, created_on FROM users')
        return res.rows
    },

    getUserByUsername: async function(username) {
        const res = await pool.query('SELECT username, email, picture, social, first_name, last_name, bio, occupation, created_on FROM users WHERE username = $1', [username])
        return res.rows[0]
    },

    addUser: async function(username, email, picture, social, first_name, last_name, bio, occupation, password) {
        const hashedPassword = bcrypt.hashSync(password, saltRounds)
        const q = 'INSERT INTO users(username, email, picture, social, first_name, last_name, bio, occupation, password) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) ON CONFLICT (username) DO NOTHING RETURNING username, email, picture, social, first_name, last_name, bio, occupation, created_on'
        const res = await pool.query(q, [username, email, picture, social, first_name, last_name, bio, occupation, hashedPassword])
        return res.rows[0]
    },

    checkPassword: async function(identifier, password) {
        const q = 'SELECT password FROM users WHERE username = $1 OR email = $1'
        const res = await pool.query(q, [identifier])
        const user = res.rows[0]
        return user && bcrypt.compareSync(password, user.password)
    },

    checkIdentification: async function(identifier) {
        const res = await pool.query('SELECT username, email, picture, social, first_name, last_name, bio, occupation, created_on FROM users WHERE username = $1 OR email = $1', [identifier])
        return res.rows[0]
    },

    // Recipes
    getRecipes: async function() {
        const res = await pool.query(`
            SELECT recipe.*, ingredient.*
            FROM recipe
            INNER JOIN ingredient
            ON recipe.iid = ingredient.iid
        `)
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

    getRecipesByUser: async function(username) {
        const res = await pool.query(`
            SELECT recipe.*, ingredient.*
            FROM recipe
            INNER JOIN ingredient
            ON recipe.iid = ingredient.iid
            WHERE username = $1
        `, [username])
        return res.rows
    },

    addRecipe: async function(title, chin_title, cuisine, username, prep_time, cook_time, servings, picture, created_on, time_last_modified, ingredients, recipe_instructions) {
        await pool.query('BEGIN')
        try {
            const ingredientRes = await pool.query('INSERT INTO ingredient(ingredients) VALUES($1) RETURNING iid', [ingredients])
            const iid = ingredientRes.rows[0].iid
            const recipeRes = await pool.query('INSERT INTO recipe(title, chin_title, cuisine, username, prep_time, cook_time, servings, picture, created_on, time_last_modified, iid, recipe_instructions) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING rid', [title, chin_title, cuisine, username, prep_time, cook_time, servings, picture, created_on, time_last_modified, iid, recipe_instructions])
            await pool.query('COMMIT')
            return recipeRes.rows[0]
        } catch (e) {
            await pool.query('ROLLBACK')
            throw e
        }
    },

    deleteRecipeById: async function(id) {
        const q = 'DELETE FROM recipe WHERE rid = $1'
        await pool.query(q, [id])
    },

    updateRecipeById: async function(id, title, chin_title, cuisine, username, prep_time, cook_time, servings, picture, created_on, time_last_modified, ingredients, recipe_instructions) {
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
    },

    // Followers
    getFollowers: async function(username) {
        const res = await pool.query('SELECT follower FROM followers WHERE followed = $1', [username])
        return res.rows
    },
    
    getFollowing: async function(username) {
        const res = await pool.query('SELECT followed FROM followers WHERE follower = $1', [username])
        return res.rows
    },
    
    followUser: async function(follower, followed) {
        const q = 'INSERT INTO followers(follower, followed) VALUES($1, $2) ON CONFLICT (follower, followed) DO NOTHING'
        const res = await pool.query(q, [follower, followed])
        return res.rows[0]
    },
    
    unfollowUser: async function(follower, followed) {
        const q = 'DELETE FROM followers WHERE follower = $1 AND followed = $2'
        const res = await pool.query(q, [follower, followed])
        return res.rows[0]
    },

    // Likes
    likeRecipe: async function(username, rid) {
        const q = 'INSERT INTO likes(username, rid) VALUES($1, $2) ON CONFLICT (username, rid) DO NOTHING'
        const res = await pool.query(q, [username, rid])
        return res.rows[0]
    },
    
    unlikeRecipe: async function(username, rid) {
        const q = 'DELETE FROM likes WHERE username = $1 AND rid = $2'
        const res = await pool.query(q, [username, rid])
        return res.rows[0]
    },
    
    getLikesOfUser: async function(username) {
        const q = `
            SELECT recipes.* 
            FROM likes 
            INNER JOIN recipes ON likes.rid = recipes.id 
            WHERE likes.username = $1
        `;
        const res = await pool.query(q, [username]);
        return res.rows;
    },

    getLikesForRecipe: async function(rid) {
        const q = 'SELECT COUNT(username) as likes FROM likes WHERE rid = $1'
        const res = await pool.query(q, [rid])
        return res.rows[0].likes
    },

    getUserLikedRecipe: async function(username, rid) {
        const q = 'SELECT EXISTS(SELECT 1 FROM likes WHERE username = $1 AND rid = $2)';
        const res = await pool.query(q, [username, rid]);
        return res.rows[0].exists;
    },

    // Notifications
    getNotifications: async function(username) {
        const q = `
            SELECT notifications.*, recipes.*, users.first_name 
            FROM notifications 
            INNER JOIN recipes ON notifications.recipe_id = recipes.id 
            INNER JOIN users ON recipes.user_id = users.id 
            WHERE notifications.username = $1
        `
        const res = await pool.query(q, [username])
        return res.rows
    },
    
    markNotificationAsRead: async function(username, rid) {
        const q = 'UPDATE notifications SET read = TRUE WHERE username = $1 AND rid = $2'
        await pool.query(q, [username, rid])
    },
    
    addNotification: async function(username, rid) {
        const q = 'INSERT INTO notifications(username, rid) VALUES($1, $2)'
        await pool.query(q, [username, rid])
    }
}

module.exports = { helpers }