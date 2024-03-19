const express = require('express');
const router = express.Router();
const notificationsService = require('./notifications.service');
const { authMiddleware } = require('../../middleware/authMiddleware');

router.get('/', authMiddleware, async (req, res) => {
    try {
        const notifications = await notificationsService.getNotifications(req.user.username);
        res.json(notifications);
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching notifications' });
    }
});

router.post('/read/:rid', authMiddleware, async (req, res) => {
    try {
        const rid = req.params.rid;
        await notificationsService.markNotificationAsRead(req.user.username, rid);
        res.json({ message: 'Notification marked as read' });
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while marking the notification as read' });
    }
});

module.exports = router;