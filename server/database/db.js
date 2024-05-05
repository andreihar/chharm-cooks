const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const saltRounds = 10;

require('dotenv').config({ path: './process.env' });
const pool = new Pool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_NAME,
	port: process.env.DB_PORT
});

const defaultData = async function () {
	const fs = require('fs');
	const users = JSON.parse(fs.readFileSync('./assets/defaultUsers.json', 'utf8'));
	const recipes = JSON.parse(fs.readFileSync('./assets/defaultRecipes.json', 'utf8'));
	for (const { username, picture, social, first_name, last_name, bio, occupation } of users) {
		await helpers.addUser(username, picture, social, first_name, last_name, bio, occupation);
	}
	for (const { title, chinTitle, cuisine, username, prepTime, cookTime, servings, picture, ingredients, recipeInstructions } of recipes) {
		await helpers.addRecipe(title, chinTitle, cuisine, username, prepTime, cookTime, servings, picture, ingredients, recipeInstructions);
	}
};

const helpers = {
	init: async function () {
		const {
			createUsersTable,
			createIngredientTable,
			createRecipeTable,
			createFollowersTable,
			createLikesTable,
			createNotificationsTable
		} = require('./tables');

		await pool.query(createUsersTable);
		await pool.query(createIngredientTable);
		await pool.query(createRecipeTable);
		await pool.query(createFollowersTable);
		await pool.query(createLikesTable);
		await pool.query(createNotificationsTable);
		if (!(await pool.query("SELECT EXISTS (SELECT 1 FROM recipe LIMIT 1);")).rows[0].exists)
			await defaultData();
	},

	// Users
	getUsers: async function () {
		const res = await pool.query('SELECT * FROM users');
		return res.rows;
	},

	getUserByUsername: async function (username) {
		const res = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
		return res.rows[0];
	},

	addUser: async function (username, picture, social, first_name, last_name, bio, occupation, country) {
		const q = `
			INSERT INTO users(username, picture, social, first_name, last_name, bio, occupation, country) 
			VALUES($1, $2, $3, $4, $5, $6, $7, $8) 
			ON CONFLICT (username) 
			DO NOTHING
			RETURNING (xmax = 0) AS is_new_user
		`;
		try {
			const res = await pool.query(q, [username, picture, social, first_name, last_name, bio, occupation, country]);
			return res.rows.length > 0 ? res.rows[0].is_new_user : false;
		} catch (error) {
			console.error('Error executing query', error);
			throw error;
		}
	},

	updateUser: async function (username, picture, social, first_name, last_name, bio = null, occupation = null, country = null) {
		const q = `
			UPDATE users
			SET picture = $2, social = COALESCE($3, social), first_name = $4, last_name = $5, bio = COALESCE($6, bio), occupation = COALESCE($7, occupation), country = COALESCE($8, country)
			WHERE username = $1
		`;
		const res = await pool.query(q, [username, picture, social, first_name, last_name, bio, occupation, country]);
		return res.rows[0];
	},

	// Recipes
	getRecipes: async function () {
		const res = await pool.query(`
			SELECT recipe.*, ingredient.*
			FROM recipe
			INNER JOIN ingredient
			ON recipe.iid = ingredient.iid
    `);
		return res.rows;
	},

	getRecipeById: async function (id) {
		const res = await pool.query(`
			SELECT recipe.*, ingredient.*
			FROM recipe
			INNER JOIN ingredient
			ON recipe.iid = ingredient.iid
			WHERE rid = $1
    `, [id]);
		return res.rows[0];
	},

	getRecipesByUser: async function (username) {
		const res = await pool.query(`
			SELECT recipe.*, ingredient.*
			FROM recipe
			INNER JOIN ingredient
			ON recipe.iid = ingredient.iid
			WHERE username = $1
		`, [username]);
		return res.rows;
	},

	addRecipe: async function (title, chin_title, cuisine, username, prep_time, cook_time, servings, picture, ingredients, recipe_instructions) {
		await pool.query('BEGIN');
		try {
			const ingredientRes = await pool.query('INSERT INTO ingredient(ingredients) VALUES($1) RETURNING iid', [ingredients]);
			const iid = ingredientRes.rows[0].iid;
			const recipeRes = await pool.query('INSERT INTO recipe(title, chin_title, cuisine, username, prep_time, cook_time, servings, picture, iid, recipe_instructions) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING rid', [title, chin_title, cuisine, username, prep_time, cook_time, servings, picture, iid, recipe_instructions]);
			await pool.query('COMMIT');
			return recipeRes.rows[0];
		} catch (e) {
			await pool.query('ROLLBACK');
			throw e;
		}
	},

	deleteRecipeById: async function (id) {
		const q = 'DELETE FROM recipe WHERE rid = $1';
		await pool.query(q, [id]);
	},

	updateRecipeById: async function (id, title, chin_title, cuisine, prep_time, cook_time, servings, picture, ingredients, recipe_instructions) {
		await pool.query('BEGIN');
		try {
			const recipeRes = await pool.query('SELECT iid FROM recipe WHERE rid = $1', [id]);
			const iid = recipeRes.rows[0].iid;
			await pool.query('UPDATE ingredient SET ingredients = $1 WHERE iid = $2', [ingredients, iid]);
			await pool.query('UPDATE recipe SET title = $1, chin_title = $2, cuisine = $3, prep_time = $4, cook_time = $5, servings = $6, picture = $7, recipe_instructions = $8, time_last_modified = $9 WHERE rid = $10', [title, chin_title, cuisine, prep_time, cook_time, servings, picture, recipe_instructions, new Date(), id]);
			await pool.query('COMMIT');
		} catch (e) {
			await pool.query('ROLLBACK');
			throw e;
		}
	},

	// Followers
	getFollowers: async function (username) {
		const res = await pool.query('SELECT follower FROM followers WHERE followed = $1', [username]);
		return res.rows;
	},

	getFollowing: async function (username) {
		const res = await pool.query('SELECT followed FROM followers WHERE follower = $1', [username]);
		return res.rows;
	},

	followUser: async function (follower, followed) {
		const q = 'INSERT INTO followers(follower, followed) VALUES($1, $2) ON CONFLICT (follower, followed) DO NOTHING';
		const res = await pool.query(q, [follower, followed]);
		return res.rows[0];
	},

	unfollowUser: async function (follower, followed) {
		const q = 'DELETE FROM followers WHERE follower = $1 AND followed = $2';
		const res = await pool.query(q, [follower, followed]);
		return res.rows[0];
	},

	// Likes
	likeRecipe: async function (username, rid) {
		const q = 'INSERT INTO likes(username, rid) VALUES($1, $2) ON CONFLICT (username, rid) DO NOTHING';
		const res = await pool.query(q, [username, rid]);
		return res.rows[0];
	},

	unlikeRecipe: async function (username, rid) {
		const q = 'DELETE FROM likes WHERE username = $1 AND rid = $2';
		const res = await pool.query(q, [username, rid]);
		return res.rows[0];
	},

	getLikesOfUser: async function (username) {
		const q = `
			SELECT recipes.* 
			FROM likes 
			INNER JOIN recipes ON likes.rid = recipes.id 
			WHERE likes.username = $1
		`;
		const res = await pool.query(q, [username]);
		return res.rows;
	},

	getLikesForRecipe: async function (rid) {
		const q = 'SELECT COUNT(username) as likes FROM likes WHERE rid = $1';
		const res = await pool.query(q, [rid]);
		return res.rows[0].likes;
	},

	getUserLikedRecipe: async function (username, rid) {
		const q = 'SELECT EXISTS(SELECT 1 FROM likes WHERE username = $1 AND rid = $2)';
		const res = await pool.query(q, [username, rid]);
		return res.rows[0].exists;
	},

	// Notifications
	getNotifications: async function (username) {
		const q = `
			SELECT notifications.*, recipes.*, users.first_name 
			FROM notifications 
			INNER JOIN recipes ON notifications.recipe_id = recipes.id 
			INNER JOIN users ON recipes.user_id = users.id 
			WHERE notifications.username = $1
		`;
		const res = await pool.query(q, [username]);
		return res.rows;
	},

	markNotificationAsRead: async function (username, rid) {
		const q = 'UPDATE notifications SET read = TRUE WHERE username = $1 AND rid = $2';
		await pool.query(q, [username, rid]);
	},

	addNotification: async function (username, rid) {
		const q = 'INSERT INTO notifications(username, rid) VALUES($1, $2)';
		await pool.query(q, [username, rid]);
	}
};

module.exports = { helpers };