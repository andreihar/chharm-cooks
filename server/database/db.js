const { Pool } = require('pg');

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
	const comments = JSON.parse(fs.readFileSync('./assets/defaultComments.json', 'utf8'));
	for (const { username, picture, social, first_name, last_name, bio, occupation, country } of users) {
		await helpers.addUser(username, picture, social, first_name, last_name, bio, occupation, country);
	}
	for (const { username, follows } of users) {
		for (const followed of follows) {
			await helpers.followUser(username, followed);
		}
	}
	for (const { title, chinTitle, cuisine, username, prepTime, cookTime, servings, picture, ingredients, recipeInstructions } of recipes) {
		await helpers.addRecipe(title, chinTitle, cuisine, username, prepTime, cookTime, servings, picture, ingredients, recipeInstructions);
	}
	for (const { username, rid, rating, comment } of comments) {
		await helpers.rateRecipe(username, rid, rating);
		await helpers.addComment(username, rid, comment);
	}
};

const helpers = {
	init: async function () {
		const {
			createUsersTable,
			createIngredientTable,
			createRecipeTable,
			createFollowersTable,
			createRatingsTable,
			createCommentsTable,
			createNotificationsTable
		} = require('./tables');

		await pool.query(createUsersTable);
		await pool.query(createIngredientTable);
		await pool.query(createRecipeTable);
		await pool.query(createFollowersTable);
		await pool.query(createRatingsTable);
		await pool.query(createCommentsTable);
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
		const defaultPicture = 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTD2mKBdUYRUA2uWZnvLw3x7cUbpgBAdqmd8_nCav_-GJ-rcAoh';
		const q = `
			INSERT INTO users(username, picture, social, first_name, last_name, bio, occupation, country) 
			VALUES($1, COALESCE(NULLIF($2, ''), $9), $3, $4, $5, $6, $7, $8) 
			ON CONFLICT (username) 
			DO NOTHING
			RETURNING (xmax = 0) AS is_new_user
		`;
		try {
			const res = await pool.query(q, [username, picture, social, first_name, last_name, bio, occupation, country, defaultPicture]);
			return res.rows.length > 0 ? res.rows[0].is_new_user : false;
		} catch (error) {
			console.error('Error executing query', error);
			throw error;
		}
	},

	updateUser: async function (username, picture, social, first_name, last_name, bio = null, occupation = null, country = null) {
		const defaultPicture = 'https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcTD2mKBdUYRUA2uWZnvLw3x7cUbpgBAdqmd8_nCav_-GJ-rcAoh';
		const q = `
			UPDATE users
			SET picture = COALESCE(NULLIF($2, ''), $9), social = COALESCE($3, social), first_name = $4, last_name = $5, bio = COALESCE($6, bio), occupation = COALESCE($7, occupation), country = COALESCE($8, country)
			WHERE username = $1
		`;
		const res = await pool.query(q, [username, picture, social, first_name, last_name, bio, occupation, country, defaultPicture]);
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
			const rid = recipeRes.rows[0].rid;
			await this.addNotification(username, 'recipe', rid);

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
		return res.rows.map(row => row.follower);
	},

	getFollowing: async function (username) {
		const res = await pool.query('SELECT followed FROM followers WHERE follower = $1', [username]);
		return res.rows.map(row => row.followed);
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

	// Ratings
	rateRecipe: async function (username, rid, rating) {
		const q = `
			INSERT INTO ratings(username, rid, rating) 
			VALUES($1, $2, $3) 
			ON CONFLICT (username, rid) 
			DO UPDATE SET rating = EXCLUDED.rating
		`;
		const res = await pool.query(q, [username, rid, rating]);
		return res.rows[0];
	},

	getRatingsOfUser: async function (username) {
		const q = `
			SELECT recipes.*, ratings.rating
			FROM ratings 
			INNER JOIN recipes ON ratings.rid = recipes.id 
			WHERE ratings.username = $1
		`;
		const res = await pool.query(q, [username]);
		return res.rows;
	},

	getAverageRatingForRecipe: async function (rid) {
		const q = 'SELECT AVG(rating) as average_rating, COUNT(rating) as rating_count FROM ratings WHERE rid = $1';
		const res = await pool.query(q, [rid]);
		return {
			average_rating: res.rows[0].average_rating !== null ? parseFloat(res.rows[0].average_rating) : 0,
			rating_count: parseInt(res.rows[0].rating_count, 10)
		};
	},

	getUserRatedRecipe: async function (username, rid) {
		const q = 'SELECT rating FROM ratings WHERE username = $1 AND rid = $2';
		const res = await pool.query(q, [username, rid]);
		return res.rows[0] ? res.rows[0].rating : null;
	},

	// Comments
	addComment: async function (username, rid, comment) {
		try {
			const ratingCheckQuery = `SELECT 1 FROM ratings WHERE username = $1 AND rid = $2;`;
			const ratingCheckRes = await pool.query(ratingCheckQuery, [username, rid]);
			if (ratingCheckRes.rowCount === 0) {
				throw new Error('User must rate the recipe before leaving a comment.');
			}

			const query = `
				INSERT INTO comments (username, rid, comment, time_last_modified)
				VALUES ($1, $2, $3, NOW())
				ON CONFLICT (username, rid)
				DO UPDATE SET comment = EXCLUDED.comment, time_last_modified = NOW()
				RETURNING *;
			`;
			const res = await pool.query(query, [username, rid, comment]);
			await this.addNotification(username, 'comment', rid);
			return res.rows[0];
		} catch (error) {
			console.error('Error adding or updating comment:', error);
			throw error;
		}
	},

	getCommentsForRecipe: async function (rid) {
		try {
			const q = `
				SELECT comments.*, users.first_name, users.last_name, users.picture, COALESCE(ratings.rating, 0) AS rating
				FROM comments
				INNER JOIN users ON comments.username = users.username
				LEFT JOIN ratings ON comments.username = ratings.username AND comments.rid = ratings.rid
				WHERE comments.rid = $1
				ORDER BY comments.time_last_modified DESC;
			`;
			const res = await pool.query(q, [rid]);
			const countQuery = `SELECT COUNT(*) AS comment_count FROM comments WHERE rid = $1;`;
			const countRes = await pool.query(countQuery, [rid]);

			return {
				comments: res.rows,
				commentCount: parseInt(countRes.rows[0].comment_count, 10)
			};
		} catch (error) {
			console.error('Error getting comments for recipe:', error);
			throw error;
		}
	},

	// Notifications
	getNotifications: async function (username) {
		const q = `
			SELECT notifications.*, first_name, last_name, users.picture AS picture, title, chin_title
			FROM notifications 
			INNER JOIN recipe ON notifications.rid = recipe.rid 
			INNER JOIN users ON notifications.followed = users.username
			WHERE notifications.username = $1
		`;
		const res = await pool.query(q, [username]);
		return res.rows;
	},

	markNotificationAsRead: async function (username, followed, mode, rid) {
		const q = 'DELETE FROM notifications WHERE username = $1 AND followed = $2 AND rid = $3 AND mode = $4';
		await pool.query(q, [username, followed, rid, mode]);
	},

	addNotification: async function (username, mode, rid) {
		const followers = await this.getFollowers(username);
		const insertNotificationQuery = `
			INSERT INTO notifications(username, followed, rid, mode)
			VALUES($1, $2, $3, $4)
		`;
		for (const follower of followers) {
			await pool.query(insertNotificationQuery, [follower, username, rid, mode]);
		}
	}
};

module.exports = { helpers };