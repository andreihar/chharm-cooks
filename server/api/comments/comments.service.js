const db = require('../../database/db');

const addComment = async (username, rid, comment) => {
	return await db.helpers.addComment(username, rid, comment);
};

const getCommentsForRecipe = async (rid) => {
	return await db.helpers.getCommentsForRecipe(rid);
};

const deleteComment = async (rid, username) => {
	return await db.helpers.deleteComment(rid, username);
};

module.exports = {
	addComment,
	getCommentsForRecipe,
	deleteComment
};