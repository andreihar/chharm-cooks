const express = require('express');
const router = express.Router();
const commentsService = require('./comments.service');
const { authMiddleware } = require('../../middleware/authMiddleware');

router.post('/add', authMiddleware, async (req, res) => {
	try {
		const { rid, comment } = req.body;
		await commentsService.addComment(req.auth.sub, rid, comment);
		res.json({ message: 'Comment added successfully' });
	} catch (err) {
		res.status(500).json({ error: 'An error occurred while adding the comment' });
	}
});

router.get('/recipe/:rid', async (req, res) => {
	try {
		const rid = req.params.rid;
		const comments = await commentsService.getCommentsForRecipe(rid);
		res.json(comments);
	} catch (err) {
		res.status(500).json({ error: 'An error occurred while fetching comments' });
	}
});

module.exports = router;