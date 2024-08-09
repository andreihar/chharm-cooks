const express = require("express");
const cors = require("cors");
const db = require("./database/db");
const app = express();
const usersController = require('./api/users/users.controller');
const recipesController = require('./api/recipes/recipes.controller');
const followersController = require('./api/followers/followers.controller');
const ratingsController = require('./api/ratings/ratings.controller');
const commentsController = require('./api/comments/comments.controller');
const notificationsController = require('./api/notifications/notifications.controller');

app.use(express.json());
app.use(cors());
let port = 4000;

app.use('/users', usersController);
app.use('/recipes', recipesController);
app.use('/followers', followersController);
app.use('/ratings', ratingsController);
app.use('/comments', commentsController);
app.use('/notifications', notificationsController);

app.use((err, _req, res, _next) => {
	console.error(err.stack);
	res.status(500).json({ error: 'An error occurred' });
});

async function InitDB() {
	try {
		await db.helpers.init();
		app.listen(port, () => console.log(`server is running on port ${port}`));
	} catch (err) {
		console.log(err);
	}
}

InitDB();