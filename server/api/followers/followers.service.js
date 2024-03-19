const db = require('../../database/db');

const getFollowers = async (username) => {
    return await db.helpers.getFollowers(username);
};

const getFollowing = async (username) => {
    return await db.helpers.getFollowing(username);
};

const followUser = async (username, followed) => {
    return await db.helpers.followUser(username, followed);
};

const unfollowUser = async (username, followed) => {
    return await db.helpers.unfollowUser(username, followed);
};

module.exports = {
    getFollowers,
    getFollowing,
    followUser,
    unfollowUser
};