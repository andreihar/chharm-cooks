const express = require("express")
const cors = require("cors")
const db = require("./database/db")
const { authMiddleware } = require('./middleware/authMiddleware')
const app = express()
const usersController = require('./api/users/users.controller')
const recipesController = require('./api/recipes/recipes.controller')

app.use(express.json())
app.use(cors())
let port = 4000

app.use('/users', usersController);
app.use('/recipes', recipesController);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'An error occurred' });
});

// Followers
app.get('/followers/:username', async (req, res) => {
    try {
        const username = req.params.username
        const followers = await db.helpers.getFollowers(username)
        res.json(followers)
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching followers' })
    }
})

app.get('/following/:username', async (req, res) => {
    try {
        const username = req.params.username
        const following = await db.helpers.getFollowing(username)
        res.json(following)
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching following' })
    }
})

app.post('/follow', authMiddleware, async (req, res) => {
    try {
        const { followed } = req.body
        if (req.user.username === followed) {
            return res.status(400).json({ error: 'You cannot follow yourself' });
        }
        await db.helpers.followUser(req.user.username, followed)
        res.json({ message: 'User followed successfully' })
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while following the user' })
    }
})

app.post('/unfollow', authMiddleware, async (req, res) => {
    try {
        const { followed } = req.body
        await db.helpers.unfollowUser(req.user.username, followed)
        res.json({ message: 'User unfollowed successfully' })
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while unfollowing the user' })
    }
})

// Likes
app.post('/like', authMiddleware, async (req, res) => {
    try {
        const { rid } = req.body
        await db.helpers.likeRecipe(req.user.username, rid)
        res.json({ message: 'Recipe liked successfully' })
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while liking the recipe' })
    }
})

app.post('/unlike', authMiddleware, async (req, res) => {
    try {
        const { rid } = req.body
        await db.helpers.unlikeRecipe(req.user.username, rid)
        res.json({ message: 'Recipe unliked successfully' })
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while unliking the recipe' })
    }
})

app.get('/likes/:username', async (req, res) => {
    try {
        const username = req.params.username
        const likes = await db.helpers.getLikesOfUser(username)
        res.json(likes)
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching likes' })
    }
})

app.get('/likes/recipe/:rid', async (req, res) => {
    try {
        const rid = req.params.rid
        const likes = await db.helpers.getLikesForRecipe(rid)
        res.json(likes)
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching likes' })
    }
})

app.get('/likes/user/:rid', authMiddleware, async (req, res) => {
    try {
        const { rid } = req.params
        const liked = await db.helpers.getUserLikedRecipe(req.user.username, rid)
        res.json(liked)
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching if user liked the recipe' })
    }
})

// Notifications
app.get('/notifications', authMiddleware, async (req, res) => {
    try {
        const notifications = await db.helpers.getNotifications(req.user.username)
        res.json(notifications)
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching notifications' })
    }
})

app.post('/notifications/read/:rid', authMiddleware, async (req, res) => {
    try {
        const rid = req.params.rid
        await db.helpers.markNotificationAsRead(req.user.username, rid)
        res.json({ message: 'Notification marked as read' })
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while marking the notification as read' })
    }
})

async function InitDB() {
    try {
        await db.helpers.init()
        app.listen(port, () => console.log(`server is running on port ${port}`))
    } catch (err) {
        console.log(err)
    }
}

InitDB()