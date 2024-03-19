const db = require('../../database/db');

const getUsers = async () => {
    return await db.helpers.getUsers();
};

const getUserByUsername = async (username) => {
    return await db.helpers.getUserByUsername(username);
};

const addUser = async ({ username, email, picture, social, first_name, last_name, bio, occupation, password }) => {
    const user = await db.helpers.addUser(username, email, picture, social, first_name, last_name, bio, occupation, password);
    if (!user) {
        return null;
    }
    return user;
};

const login = async ({ username, password }) => {
    const user = await db.helpers.checkIdentification(username);
    if (!user) {
        throw new Error('Invalid username');
    }
    const isPasswordValid = await db.helpers.checkPassword(username, password);
    if (!isPasswordValid) {
        throw new Error('Invalid password');
    }
    delete user.password;
    return user;
};

module.exports = {
    getUsers,
    getUserByUsername,
    addUser,
    login
};