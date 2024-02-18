import axios from 'axios';
import { User } from '../models/User';

const BASE_URL = 'http://localhost:4000';

const getUsers = () => {
  return axios.get(`${BASE_URL}/getusers`);
};

const addUser = (newUser: User) => {
  return axios.post(`${BASE_URL}/adduser`, newUser);
};

const DbService = {
  getUsers,
  addUser
};

export default DbService;