import axios from 'axios';
import Cookies from 'js-cookie';
import { jwtDecode } from "jwt-decode";
import { User } from '../models/User';
import { Recipe } from '../models/Recipe';

const BASE_URL = 'http://localhost:4000';

const token = Cookies.get('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

interface LoginResponse {
  user: User;
  token: string;
};

// Authentication
const setAuthHeadersAndCookies = (response: LoginResponse) => {
  axios.defaults.headers.common['Authorization'] = `Bearer ${response.token}`;
  const decodedToken = jwtDecode(response.token);
  if (decodedToken.exp) {
    const expirationDate = new Date(decodedToken.exp * 1000);
    Cookies.set('token', response.token, { expires: expirationDate });
    Cookies.set('authUser', JSON.stringify(response.user), { expires: expirationDate });
  } else {
    Cookies.set('token', response.token);
    Cookies.set('authUser', JSON.stringify(response.user));
  }
};

const login = (username: string, password: string): Promise<User> => {
  return axios.post<LoginResponse>(`${BASE_URL}/login`, { username, password })
    .then(response => {
      setAuthHeadersAndCookies(response.data);
      return response.data.user;
    })
    .catch(error => {
      console.error('Error logging in', error);
      throw error;
    });
};

// Users
const getUsers = (): Promise<User[]> => {
  return axios.get<User[]>(`${BASE_URL}/users`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching users', error);
      return [];
    });
};

const getUserByName = (username:string): Promise<User> => {
  return axios.get<User>(`${BASE_URL}/users/${username}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching user', error);
      throw error;
    });
};

const addUser = (newUser: User, password: string): Promise<User> => {
  return axios.post<LoginResponse>(`${BASE_URL}/users`, { ...newUser, password })
    .then(response => {
      setAuthHeadersAndCookies(response.data);
      return response.data.user;
    })
    .catch(error => {
      console.error('Error signing up', error);
      throw error;
    });
};

const logout = () => {
  delete axios.defaults.headers.common['Authorization'];
  Cookies.remove('token');
  Cookies.remove('authUser');
};

// Recipes
const getRecipes = (): Promise<Recipe[]> => {
  return axios.get<Recipe[]>(`${BASE_URL}/recipes`)
    .then(response => response.data.map(recipe => ({
      ...recipe,
      created_on: new Date(recipe.created_on),
      time_last_modified: new Date(recipe.time_last_modified)
    })))
    .catch(error => {
      console.error('Error fetching recipes', error);
      return [];
    });
};

const getRecipeById = (id:number): Promise<Recipe> => {
  return axios.get<Recipe>(`${BASE_URL}/recipes/${id}`)
    .then(response => ({
      ...response.data,
      created_on: new Date(response.data.created_on),
      time_last_modified: new Date(response.data.time_last_modified)
    }))
    .catch(error => {
      console.error('Error fetching recipe', error);
      throw error;
    });
};

const addRecipe = (newRecipe: Recipe) => {
  return axios.post(`${BASE_URL}/recipes`, newRecipe);
};

const deleteRecipe = (id:number) => {
  return axios.delete(`${BASE_URL}/recipes/${id}`);
};

const updateRecipe = (id:number, updateRecipe: Recipe) => {
  return axios.put(`${BASE_URL}/recipes/${id}`, updateRecipe);
}

const DbService = {
  getUsers,
  getUserByName,
  addUser,
  login,
  logout,
  getRecipes,
  getRecipeById,
  addRecipe,
  deleteRecipe,
  updateRecipe
};

export default DbService;