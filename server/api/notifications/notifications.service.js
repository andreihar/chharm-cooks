const db = require('../../database/db');

const getNotifications = async (username) => {
	return await db.helpers.getNotifications(username);
};

const markNotificationAsRead = async (username, followed, mode, rid) => {
	return await db.helpers.markNotificationAsRead(username, followed, mode, rid);
};

module.exports = {
	getNotifications,
	markNotificationAsRead
};