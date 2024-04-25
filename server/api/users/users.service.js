const db = require('../../database/db');

const getUsers = async () => {
	return await db.helpers.getUsers();
};

const getUserByUsername = async (username) => {
	return await db.helpers.getUserByUsername(username);
};

const addUser = async ({ username, email, picture, social, first_name, last_name, bio, occupation }) => {
	const user = await db.helpers.addUser(username, email, picture, social, first_name, last_name, bio, occupation);
	if (!user) {
		return null;
	}
	return user;
};

module.exports = {
	getUsers,
	getUserByUsername,
	addUser
};