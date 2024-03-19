const express = require('express');
const router = express.Router();
const likesService = require('./likes.service');
const { authMiddleware } = require('../../middleware/authMiddleware');

router.post('/like', authMiddleware, async (req, res) => {
    try {
        const { rid } = req.body;
        await likesService.likeRecipe(req.user.username, rid);
        res.json({ message: 'Recipe liked successfully' });
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while liking the recipe' });
    }
});

router.post('/unlike', authMiddleware, async (req, res) => {
    try {
        const { rid } = req.body;
        await likesService.unlikeRecipe(req.user.username, rid);
        res.json({ message: 'Recipe unliked successfully' });
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while unliking the recipe' });
    }
});

router.get('/:username', async (req, res) => {
    try {
        const username = req.params.username;
        const likes = await likesService.getLikesOfUser(username);
        res.json(likes);
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching likes' });
    }
});

router.get('/recipe/:rid', async (req, res) => {
    try {
        const rid = req.params.rid;
        const likes = await likesService.getLikesForRecipe(rid);
        res.json(likes);
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching likes' });
    }
});

router.get('/user/:rid', authMiddleware, async (req, res) => {
    try {
        const { rid } = req.params;
        const liked = await likesService.getUserLikedRecipe(req.user.username, rid);
        res.json(liked);
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching if user liked the recipe' });
    }
});

module.exports = router;