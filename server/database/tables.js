const createUsersTable = `
	CREATE TABLE IF NOT EXISTS users(
		username VARCHAR(50) PRIMARY KEY,
		password VARCHAR(60) NOT NULL,
		email VARCHAR(255) UNIQUE NOT NULL,
		picture TEXT,
		social TEXT,
		first_name VARCHAR(50),
		last_name VARCHAR(50),
		bio TEXT,
		occupation VARCHAR(100),
		created_on TIMESTAMPTZ DEFAULT NOW()
	);
`;

const createIngredientTable = `
	CREATE TABLE IF NOT EXISTS ingredient(
		iid SERIAL PRIMARY KEY, 
		ingredients TEXT[]
	);
`;

const createRecipeTable = `
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
		created_on TIMESTAMPTZ DEFAULT NOW(),
		time_last_modified TIMESTAMPTZ DEFAULT NOW(),
		iid INT,
		FOREIGN KEY (iid) REFERENCES ingredient(iid) ON DELETE CASCADE,
		recipe_instructions TEXT[]
	);
`;

const createFollowersTable = `
	CREATE TABLE IF NOT EXISTS followers(
		follower VARCHAR(50),
		followed VARCHAR(50),
		PRIMARY KEY (follower, followed),
		FOREIGN KEY (follower) REFERENCES users(username) ON DELETE CASCADE,
		FOREIGN KEY (followed) REFERENCES users(username) ON DELETE CASCADE
	);
`;

const createLikesTable = `
	CREATE TABLE IF NOT EXISTS likes(
		username VARCHAR(50),
		rid SERIAL,
		PRIMARY KEY (username, rid),
		FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE,
		FOREIGN KEY (rid) REFERENCES recipe(rid) ON DELETE CASCADE
	);
`;

const createNotificationsTable = `
	CREATE TABLE IF NOT EXISTS notifications(
		username VARCHAR(50),
		rid INT,
		read BOOLEAN DEFAULT FALSE,
		PRIMARY KEY (username, rid),
		FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE,
		FOREIGN KEY (rid) REFERENCES recipe(rid) ON DELETE CASCADE
	);
`;

module.exports = {
	createUsersTable,
	createIngredientTable,
	createRecipeTable,
	createFollowersTable,
	createLikesTable,
	createNotificationsTable
};