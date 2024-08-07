const db = require('../../database/db');

const rateRecipe = async (username, rid, rating) => {
	return await db.helpers.rateRecipe(username, rid, rating);
};

const getRatingsOfUser = async (username) => {
	return await db.helpers.getRatingsOfUser(username);
};

const getAverageRatingForRecipe = async (rid) => {
	return await db.helpers.getAverageRatingForRecipe(rid);
};

const getUserRatedRecipe = async (username, rid) => {
	return await db.helpers.getUserRatedRecipe(username, rid);
};

module.exports = {
	rateRecipe,
	getRatingsOfUser,
	getAverageRatingForRecipe,
	getUserRatedRecipe
};