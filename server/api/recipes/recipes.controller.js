const express = require('express');
const router = express.Router();
const recipesService = require('./recipes.service');
const { authMiddleware } = require('../../middleware/authMiddleware');

router.get('/', async (req, res) => {
    try {
        const recipes = await recipesService.getRecipes();
        res.json(recipes);
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching recipes' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const recipe = await recipesService.getRecipeById(id);
        res.json(recipe);
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching the recipe' });
    }
});

router.get('/user/:username', async (req, res) => {
    try {
        const username = req.params.username;
        const recipes = await recipesService.getRecipesByUser(username);
        res.json(recipes);
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching the recipes' });
    }
});

router.post('/', authMiddleware, async (req, res) => {
    try {
        const recipe = await recipesService.addRecipe(req.body);
        res.status(200).json({ message: 'Recipe added successfully' });
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while adding the recipe' });
    }
});

router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const id = req.params.id;
        await recipesService.deleteRecipeById(id, req.user.username);
        res.json({ message: 'Recipe deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while deleting the recipe' });
    }
});

router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const id = req.params.id;
        console.log(req.user.username)
        await recipesService.updateRecipeById(id, req.body, req.user.username);
        console.log("We come out of recipesService")
        res.json({ message: 'Recipe updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while updating the recipe' });
    }
});

module.exports = router;