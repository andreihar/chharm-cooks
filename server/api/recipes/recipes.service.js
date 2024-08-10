const db = require('../../database/db');

const getRecipes = async () => {
	return await db.helpers.getRecipes();
};

const getRecipeById = async (id) => {
	return await db.helpers.getRecipeById(id);
};

const getRecipesByUser = async (username) => {
	return await db.helpers.getRecipesByUser(username);
};

const addRecipe = async (recipe) => {
	const { title, chin_title, cuisine, username, prep_time, cook_time, servings, picture, ingredients, recipe_instructions, content } = recipe;
	const newRecipe = await db.helpers.addRecipe(title, chin_title, cuisine, username, prep_time, cook_time, servings, picture, ingredients, recipe_instructions, content);
	return newRecipe;
};

const deleteRecipeById = async (id, username) => {
	const recipe = await db.helpers.getRecipeById(id);
	if (recipe.username !== username) {
		throw new Error('You are not authorized to delete this recipe');
	}
	await db.helpers.deleteRecipeById(id);
};

const updateRecipeById = async (id, recipe, username) => {
	const existingRecipe = await db.helpers.getRecipeById(id);
	if (existingRecipe.username !== username) {
		throw new Error('You are not authorized to update this recipe');
	}
	const { title, chin_title, cuisine, prep_time, cook_time, servings, picture, ingredients, recipe_instructions, content } = recipe;
	await db.helpers.updateRecipeById(id, title, chin_title, cuisine, prep_time, cook_time, servings, picture, ingredients, recipe_instructions, content);
};

module.exports = {
	getRecipes,
	getRecipeById,
	getRecipesByUser,
	addRecipe,
	deleteRecipeById,
	updateRecipeById
};