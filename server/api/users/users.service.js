const db = require('../../database/db');

const getUsers = async () => {
	return await db.helpers.getUsers();
};

const getUserByUsername = async (username) => {
	return await db.helpers.getUserByUsername(username);
};

const addUser = async ({ username, picture, social, first_name, last_name, bio, occupation, country }) => {
	const isNewUser = await db.helpers.addUser(username, picture, social, first_name, last_name, bio, occupation, country);
	return isNewUser;
};

const updateUser = async (userData, authUsername) => {
	return await db.helpers.updateUser(authUsername, userData.picture, userData.social, userData.first_name, userData.last_name, userData.bio, userData.occupation, userData.country);
};

module.exports = {
	getUsers,
	getUserByUsername,
	addUser,
	updateUser
};