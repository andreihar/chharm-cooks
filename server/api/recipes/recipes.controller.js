const express = require('express');
const router = express.Router();
const TurndownService = require('turndown');
const turndownService = new TurndownService();
const markdownit = require('markdown-it');
const md = new markdownit();
const recipesService = require('./recipes.service');
const { authMiddleware } = require('../../middleware/authMiddleware');

router.get('/', async (_req, res) => {
	try {
		const recipes = await recipesService.getRecipes();
		const modifiedRecipes = recipes.map(recipe => ({ ...recipe, content: md.render(recipe.content) }));
		res.json(modifiedRecipes);
	} catch (err) {
		res.status(500).json({ error: 'An error occurred while fetching recipes' });
	}
});

router.get('/:id', async (req, res) => {
	try {
		const recipe = await recipesService.getRecipeById(req.params.id);
		res.json({ ...recipe, content: md.render(recipe.content) });
	} catch (err) {
		res.status(500).json({ error: 'An error occurred while fetching the recipe' });
	}
});

router.get('/user/:username', async (req, res) => {
	try {
		const recipes = await recipesService.getRecipesByUser(req.params.username);
		const modifiedRecipes = recipes.map(recipe => ({ ...recipe, content: md.render(recipe.content) }));
		res.json(modifiedRecipes);
	} catch (err) {
		res.status(500).json({ error: 'An error occurred while fetching the recipes' });
	}
});

router.post('/', authMiddleware, async (req, res) => {
	try {
		req.body.content = turndownService.turndown(req.body.content);
		await recipesService.addRecipe(req.body);
		res.status(200).json({ message: 'Recipe added successfully' });
	} catch (err) {
		res.status(500).json({ error: 'An error occurred while adding the recipe' });
	}
});

router.delete('/:id', authMiddleware, async (req, res) => {
	try {
		await recipesService.deleteRecipeById(req.params.id, req.auth.sub);
		res.json({ message: 'Recipe deleted successfully' });
	} catch (err) {
		res.status(500).json({ error: 'An error occurred while deleting the recipe' });
	}
});

router.put('/:id', authMiddleware, async (req, res) => {
	try {
		req.body.content = turndownService.turndown(req.body.content);
		await recipesService.updateRecipeById(req.params.id, req.body, req.auth.sub);
		res.json({ message: 'Recipe updated successfully' });
	} catch (err) {
		res.status(500).json({ error: 'An error occurred while updating the recipe' });
	}
});

module.exports = router;