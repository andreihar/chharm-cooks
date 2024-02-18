import axios from 'axios';
import { Author } from '../models/Author';

const BASE_URL = 'http://localhost:4000';

const getUsers = () => {
  return axios.get(`${BASE_URL}/getusers`);
};

const addUser = (newUser: Author) => {
  return axios.post(`${BASE_URL}/adduser`, newUser);
};

const DbService = {
  getUsers,
  addUser
};

export default DbService;