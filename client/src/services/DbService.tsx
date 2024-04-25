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

// Users
const getUsers = (): Promise<User[]> => {
  return axios.get<User[]>(`${BASE_URL}/users`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching users', error);
      return [];
    });
};

const getUserByName = (username: string): Promise<User> => {
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
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching recipes', error);
      return [];
    });
};

const getRecipeById = (id: number): Promise<Recipe> => {
  return axios.get<Recipe>(`${BASE_URL}/recipes/${id}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching recipe', error);
      throw error;
    });
};

const getRecipesByUsername = (username: string): Promise<Recipe[]> => {
  return axios.get<Recipe[]>(`${BASE_URL}/recipes/user/${username}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching recipes by username', error);
      return [];
    });
};

const addRecipe = (newRecipe: Recipe) => {
  return axios.post(`${BASE_URL}/recipes`, newRecipe);
};

const deleteRecipe = (id: number) => {
  return axios.delete(`${BASE_URL}/recipes/${id}`);
};

const updateRecipe = (id: number, updateRecipe: Recipe) => {
  return axios.put(`${BASE_URL}/recipes/${id}`, updateRecipe);
};

// Followers
const getFollowers = async (username: string): Promise<string[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/followers/${username}`);
    return response.data;
  } catch (error) {
    console.error('An error occurred while fetching followers', error);
    throw error;
  }
};

const getFollowing = async (username: string): Promise<string[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/followers/following/${username}`);
    return response.data;
  } catch (error) {
    console.error('An error occurred while fetching following', error);
    throw error;
  }
};

const followUser = (followed: string) => {
  return axios.post(`${BASE_URL}/followers/follow`, { followed });
};

const unfollowUser = (followed: string) => {
  return axios.post(`${BASE_URL}/followers/unfollow`, { followed });
};

// Likes
const likeRecipe = (rid: number) => {
  return axios.post(`${BASE_URL}/likes/like`, { rid });
};

const unlikeRecipe = (rid: number) => {
  return axios.post(`${BASE_URL}/likes/unlike`, { rid });
};

const getLikesByUsername = (username: string): Promise<Recipe[]> => {
  return axios.get<Recipe[]>(`${BASE_URL}/likes/${username}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching likes', error);
      throw error;
    });
};

const getLikesForRecipe = (rid: number): Promise<number> => {
  return axios.get<number>(`${BASE_URL}/likes/recipe/${rid}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching likes for recipe', error);
      throw error;
    });
};

const getUserLikedRecipe = (rid: number): Promise<boolean> => {
  return axios.get<boolean>(`${BASE_URL}/likes/user/${rid}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching if user liked the recipe', error);
      throw error;
    });
};

const DbService = {
  getUsers,
  getUserByName,
  addUser,
  // login,
  logout,
  getRecipes,
  getRecipeById,
  getRecipesByUsername,
  addRecipe,
  deleteRecipe,
  updateRecipe,
  getFollowers,
  getFollowing,
  followUser,
  unfollowUser,
  likeRecipe,
  unlikeRecipe,
  getLikesByUsername,
  getLikesForRecipe,
  getUserLikedRecipe
};

export default DbService;