import axios from 'axios';
import Cookies from 'js-cookie';
import { User } from '../models/User';
import { Recipe } from '../models/Recipe';
import { Comment } from '../models/Comment';
import { Notification } from '../models/Notification';

const BASE_URL = import.meta.env.VITE_BASE_URL;

const token = Cookies.get('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

const convertRecipeDates = (recipe: Recipe): Recipe => {
  return {
    ...recipe,
    created_on: new Date(recipe.created_on),
    time_last_modified: new Date(recipe.time_last_modified)
  };
};

const login = (user: User, token: string): Promise<boolean> => {
  Cookies.set('token', token);
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  return axios.post<{ isNewUser: boolean; }>(`${BASE_URL}/users/login`, user)
    .then(response => response.data.isNewUser)
    .catch(error => {
      console.error('Error logging in user', error);
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

const getUserByName = (username: string): Promise<User> => {
  return axios.get<User>(`${BASE_URL}/users/${username}`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching user', error);
      throw error;
    });
};

const updateUser = (user: Partial<User>): Promise<boolean> => {
  return axios.put(`${BASE_URL}/users`, user)
    .then(response => response.status === 200)
    .catch(error => {
      console.error('Error updating user', error);
      throw error;
    });
};

const logout = () => {
  delete axios.defaults.headers.common['Authorization'];
  Cookies.remove('token');
};

// Recipes
const getRecipes = (): Promise<Recipe[]> => {
  return axios.get<Recipe[]>(`${BASE_URL}/recipes`)
    .then(response => response.data.map(convertRecipeDates))
    .catch(error => {
      console.error('Error fetching recipes', error);
      return [];
    });
};

const getRecipeById = (id: number): Promise<Recipe> => {
  return axios.get<Recipe>(`${BASE_URL}/recipes/${id}`)
    .then(response => convertRecipeDates(response.data))
    .catch(error => {
      console.error('Error fetching recipe', error);
      throw error;
    });
};

const getRecipesByUsername = (username: string): Promise<Recipe[]> => {
  return axios.get<Recipe[]>(`${BASE_URL}/recipes/user/${username}`)
    .then(response => response.data.map(convertRecipeDates))
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
const getFollowers = (username: string): Promise<string[]> => {
  return axios.get(`${BASE_URL}/followers/${username}`)
    .then(response => response.data)
    .catch(error => {
      console.error('An error occurred while fetching followers', error);
      throw error;
    });
};

const getFollowing = (username: string): Promise<string[]> => {
  return axios.get(`${BASE_URL}/followers/following/${username}`)
    .then(response => response.data)
    .catch(error => {
      console.error('An error occurred while fetching following', error);
      throw error;
    });
};

const followUser = (followed: string) => {
  return axios.post(`${BASE_URL}/followers/follow`, { followed });
};

const unfollowUser = (followed: string) => {
  return axios.post(`${BASE_URL}/followers/unfollow`, { followed });
};

// Ratings
const rateRecipe = (rid: number, rating: number) => {
  return axios.post(`${BASE_URL}/ratings/rate`, { rid, rating });
};

const getRatingsByUsername = (username: string): Promise<Recipe[]> => {
  return axios.get<Recipe[]>(`${BASE_URL}/ratings/${username}`)
    .then(response => response.data.map(convertRecipeDates))
    .catch(error => {
      console.error('Error fetching ratings', error);
      throw error;
    });
};

const getAverageRatingForRecipe = (rid: number): Promise<{ averageRating: number; ratingCount: number; }> => {
  return axios.get<{ averageRating: { average_rating: number; rating_count: number; }; }>(`${BASE_URL}/ratings/recipe/${rid}`)
    .then(response => {
      return {
        averageRating: response.data.averageRating.average_rating,
        ratingCount: response.data.averageRating.rating_count
      };
    })
    .catch(error => {
      console.error('Error fetching average rating for recipe', error);
      return { averageRating: 0, ratingCount: 0 };
    });
};

const getUserRatingForRecipe = (rid: number): Promise<number | null> => {
  return axios.get<{ rating: number | null; }>(`${BASE_URL}/ratings/user/${rid}`)
    .then(response => response.data.rating)
    .catch(error => {
      console.error('Error fetching user rating for recipe', error);
      throw error;
    });
};

// Comments
const addComment = (rid: number, comment: string): Promise<{ message: string; }> => {
  return axios.post<{ message: string; }>(`${BASE_URL}/comments/add`, { rid, comment })
    .then(response => response.data)
    .catch(error => {
      console.error('Error adding comment', error);
      throw error;
    });
};

const getCommentsForRecipe = (rid: number): Promise<{ comments: Array<Comment>; totalCount: number; }> => {
  return axios.get<{ comments: Array<Comment>; commentCount: number; }>(`${BASE_URL}/comments/recipe/${rid}`)
    .then(response => ({
      comments: response.data.comments,
      totalCount: response.data.commentCount
    }))
    .catch(error => {
      console.error('Error fetching comments for recipe', error);
      throw error;
    });
};

// Notifications
const getNotifications = (): Promise<Array<Notification>> => {
  return axios.get<Array<Notification>>(`${BASE_URL}/notifications`)
    .then(response => response.data)
    .catch(error => {
      console.error('Error fetching notifications', error);
      throw error;
    });
};

const markNotificationAsRead = (followed: string, mode: string, rid: number): Promise<{ message: string; }> => {
  return axios.post<{ message: string; }>(`${BASE_URL}/notifications`, { followed, mode, rid })
    .then(response => response.data)
    .catch(error => {
      console.error('Error marking notification as read', error);
      throw error;
    });
};

const DbService = {
  getUsers,
  getUserByName,
  updateUser,
  login,
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
  rateRecipe,
  getRatingsByUsername,
  getAverageRatingForRecipe,
  getUserRatingForRecipe,
  addComment,
  getCommentsForRecipe,
  getNotifications,
  markNotificationAsRead
};

export default DbService;