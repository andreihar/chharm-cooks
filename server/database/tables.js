const createUsersTable = `
	CREATE TABLE IF NOT EXISTS users(
		username VARCHAR(255) PRIMARY KEY,
		picture TEXT,
		social TEXT,
		first_name VARCHAR(255),
		last_name VARCHAR(255),
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
		username VARCHAR(255),
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
		follower VARCHAR(255),
		followed VARCHAR(255),
		PRIMARY KEY (follower, followed),
		FOREIGN KEY (follower) REFERENCES users(username) ON DELETE CASCADE,
		FOREIGN KEY (followed) REFERENCES users(username) ON DELETE CASCADE
	);
`;

const createLikesTable = `
	CREATE TABLE IF NOT EXISTS likes(
		username VARCHAR(255),
		rid SERIAL,
		PRIMARY KEY (username, rid),
		FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE,
		FOREIGN KEY (rid) REFERENCES recipe(rid) ON DELETE CASCADE
	);
`;

const createNotificationsTable = `
	CREATE TABLE IF NOT EXISTS notifications(
		username VARCHAR(255),
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