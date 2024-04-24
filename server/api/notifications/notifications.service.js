const db = require('../../database/db');

const getNotifications = async (username) => {
	return await db.helpers.getNotifications(username);
};

const markNotificationAsRead = async (username, rid) => {
	return await db.helpers.markNotificationAsRead(username, rid);
};

module.exports = {
	getNotifications,
	markNotificationAsRead
};