const express = require('express');
const router = express.Router();
const ratingsService = require('./ratings.service');
const { authMiddleware } = require('../../middleware/authMiddleware');

router.post('/rate', authMiddleware, async (req, res) => {
	try {
		const { rid, rating } = req.body;
		await ratingsService.rateRecipe(req.auth.sub, rid, rating);
		res.json({ message: 'Recipe rated successfully' });
	} catch (err) {
		res.status(500).json({ error: 'An error occurred while rating the recipe' });
	}
});

router.get('/:username', async (req, res) => {
	try {
		const username = req.params.username;
		const ratings = await ratingsService.getRatingsOfUser(username);
		res.json(ratings);
	} catch (err) {
		res.status(500).json({ error: 'An error occurred while fetching ratings' });
	}
});

router.get('/recipe/:rid', async (req, res) => {
	try {
		const rid = req.params.rid;
		const averageRating = await ratingsService.getAverageRatingForRecipe(rid);
		res.json({ averageRating });
	} catch (err) {
		res.status(500).json({ error: 'An error occurred while fetching the average rating' });
	}
});

router.get('/user/:rid', authMiddleware, async (req, res) => {
	try {
		const { rid } = req.params;
		const rating = await ratingsService.getUserRatedRecipe(req.auth.sub, rid);
		res.json({ rating });
	} catch (err) {
		res.status(500).json({ error: 'An error occurred while fetching the user rating' });
	}
});

module.exports = router;