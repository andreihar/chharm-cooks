const express = require('express');
const router = express.Router();
const usersService = require('./users.service');
const { authenticateUser } = require('../../middleware/authMiddleware');

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

router.post('/', async (req, res) => {
    try {
        console.log(req.body)
        const user = await usersService.addUser(req.body);
        if (!user) {
            return res.status(400).json({ error: 'Username is already taken' });
        }
        await authenticateUser(req, res, user);
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while adding the user' });
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await usersService.login({ username, password });
        await authenticateUser(req, res, user);
    } catch (err) {
        if (err.message === 'Invalid username') {
            res.status(404).json({ error: 'Invalid username' });
        } else if (err.message === 'Invalid password') {
            res.status(401).json({ error: 'Invalid password' });
        } else {
            next(err);
        }
    }
});

module.exports = router;