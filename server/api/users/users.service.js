const db = require('../../database/db');

const getUsers = async () => {
	return await db.helpers.getUsers();
};

const getUserByUsername = async (username) => {
	return await db.helpers.getUserByUsername(username);
};

const addUser = async ({ username, picture, social, first_name, last_name, bio, occupation }) => {
	const isNewUser = await db.helpers.addUser(username, picture, social, first_name, last_name, bio, occupation);
	return isNewUser;
};

module.exports = {
	getUsers,
	getUserByUsername,
	addUser
};