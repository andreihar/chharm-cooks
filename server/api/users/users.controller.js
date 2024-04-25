const express = require('express');
const router = express.Router();
const usersService = require('./users.service');

router.get('/', async (req, res) => {
	try {
		let users = await usersService.getUsers();
		res.json(users);
	} catch (err) {
		res.status(500).json({ error: 'An error occurred while fetching users' });
	}
});

router.get('/:username', async (req, res) => {
	try {
		let user = await usersService.getUserByUsername(req.params.username);
		res.json(user);
	} catch (err) {
		res.status(500).json({ error: 'An error occurred while fetching the user' });
	}
});

router.post('/login', async (req, res) => {
	try {
		await usersService.addUser(req.body);
	} catch (err) {
		res.status(500).json({ error: 'An error occurred while logging in' });
	}
});

module.exports = router;