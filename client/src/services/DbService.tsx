import axios from 'axios';
import { User } from '../models/User';
import { Recipe } from '../models/Recipe';

const BASE_URL = 'http://localhost:4000';

const mapDbToRecipe = (dbRecipe: any): Recipe => {
  return {
    rid: dbRecipe.rid,
    title: dbRecipe.title,
    chinTitle: dbRecipe.chin_title,
    cuisine: dbRecipe.cuisine,
    username: dbRecipe.username,
    prepTime: dbRecipe.prep_time,
    cookTime: dbRecipe.cook_time,
    servings: dbRecipe.servings,
    picture: dbRecipe.picture,
    createdOn: new Date(dbRecipe.created_on),
    timeLastModified: new Date(dbRecipe.time_last_modified),
    ingredients: dbRecipe.ingredients,
    recipeInstructions: dbRecipe.recipe_instructions
  };
}

// Users
const getUsers = (): Promise<User[]> => {
  return axios.get<User[]>(`${BASE_URL}/getusers`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching users', error);
      return [];
    });
};

const getUserByName = (username:string): Promise<User> => {
  return axios.get<User>(`${BASE_URL}/getuser/${username}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching user', error);
      throw error;
    });
};

const addUser = (newUser: User) => {
  return axios.post(`${BASE_URL}/adduser`, newUser);
};

// Recipes

const getRecipes = (): Promise<Recipe[]> => {
  return axios.get<Recipe[]>(`${BASE_URL}/getrecipes`)
    .then(response => response.data.map(mapDbToRecipe))
    .catch(error => {
      console.error('Error fetching recipes', error);
      return [];
    });
};

const getRecipeById = (id:number): Promise<Recipe> => {
  return axios.get<Recipe>(`${BASE_URL}/getrecipe/${id}`)
    .then(response => mapDbToRecipe(response.data))
    .catch(error => {
      console.error('Error fetching recipe', error);
      throw error;
    });
};

const addRecipe = (newRecipe: Recipe) => {
  return axios.post(`${BASE_URL}/addrecipe`, newRecipe);
};

const DbService = {
  getUsers,
  getUserByName,
  addUser,
  getRecipes,
  getRecipeById,
  addRecipe
};

export default DbService;