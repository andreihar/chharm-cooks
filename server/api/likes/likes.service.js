const db = require('../../database/db');

const likeRecipe = async (username, rid) => {
	return await db.helpers.likeRecipe(username, rid);
};

const unlikeRecipe = async (username, rid) => {
	return await db.helpers.unlikeRecipe(username, rid);
};

const getLikesOfUser = async (username) => {
	return await db.helpers.getLikesOfUser(username);
};

const getLikesForRecipe = async (rid) => {
	return await db.helpers.getLikesForRecipe(rid);
};

const getUserLikedRecipe = async (username, rid) => {
	return await db.helpers.getUserLikedRecipe(username, rid);
};

module.exports = {
	likeRecipe,
	unlikeRecipe,
	getLikesOfUser,
	getLikesForRecipe,
	getUserLikedRecipe
};