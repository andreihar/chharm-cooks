const express = require('express');
const router = express.Router();
const followersService = require('./followers.service');
const { authMiddleware } = require('../../middleware/authMiddleware');

router.get('/:username', async (req, res) => {
	try {
		const username = req.params.username;
		const followers = await followersService.getFollowers(username);
		res.json(followers);
	} catch (err) {
		res.status(500).json({ error: 'An error occurred while fetching followers' });
	}
});

router.get('/following/:username', async (req, res) => {
	try {
		const username = req.params.username;
		const following = await followersService.getFollowing(username);
		res.json(following);
	} catch (err) {
		res.status(500).json({ error: 'An error occurred while fetching following' });
	}
});

router.post('/follow', authMiddleware, async (req, res) => {
	try {
		const { followed } = req.body;
		if (req.user.username === followed) {
			return res.status(400).json({ error: 'You cannot follow yourself' });
		}
		await followersService.followUser(req.user.username, followed);
		res.json({ message: 'User followed successfully' });
	} catch (err) {
		res.status(500).json({ error: 'An error occurred while following the user' });
	}
});

router.post('/unfollow', authMiddleware, async (req, res) => {
	try {
		const { followed } = req.body;
		await followersService.unfollowUser(req.user.username, followed);
		res.json({ message: 'User unfollowed successfully' });
	} catch (err) {
		res.status(500).json({ error: 'An error occurred while unfollowing the user' });
	}
});

module.exports = router;