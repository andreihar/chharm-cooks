const express = require('express');
const router = express.Router();
const notificationsService = require('./notifications.service');
const { authMiddleware } = require('../../middleware/authMiddleware');

router.get('/', authMiddleware, async (req, res) => {
	try {
		const notifications = await notificationsService.getNotifications(req.auth.sub);
		// const sanitizedNotifications = notifications.map(({ username, ...rest }) => rest);
		res.json(notifications.map(({ username, ...rest }) => rest));
	} catch (err) {
		res.status(500).json({ error: 'An error occurred while fetching notifications' });
	}
});

router.post('/', authMiddleware, async (req, res) => {
	try {
		const { followed, mode, rid } = req.body;
		await notificationsService.markNotificationAsRead(req.auth.sub, followed, mode, rid);
		res.json({ message: 'Notification marked as read' });
	} catch (err) {
		res.status(500).json({ error: 'An error occurred while marking the notification as read' });
	}
});

module.exports = router;