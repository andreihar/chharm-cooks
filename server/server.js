const express = require("express")
const cors = require("cors")
const db = require("./db")
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: './process.env' })
const app = express()
const secretKey = process.env.JWT_SECRET_KEY

app.use(express.json())
app.use(cors())
let port = 4000

// Authentication
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (authHeader) {
        const token = authHeader.split(' ')[1]
        jwt.verify(token, secretKey, (err, user) => {
            if (err) {
                console.log('Error verifying token:', err)
                return res.sendStatus(403)
            }
            req.user = user
            next()
        })
    } else {
        res.sendStatus(401)
    }
}

const authenticateUser = async (req, res, user) => {
    const token = jwt.sign({ username: user.username }, secretKey, { expiresIn: '1h' })
    res.json({ user, token })
}


// Users
app.get('/users', async (req, res) => {
    try {
        let p = await db.helpers.getUsers()
        res.json(p)
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching users' })
    }
})

app.get('/users/:username', async (req, res) => {
    try {
        let username = req.params.username
        let p = await db.helpers.getUserByUsername(username)
        res.json(p)
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching the user' })
    }
})

app.post('/users', async (req, res) => {
    try {
        const { username, password, picture, social } = req.body
        const user = await db.helpers.addUser(username, password, picture, social)
        if (!user) {
            return res.status(400).json({ error: 'Username is already taken' });
        }
        await authenticateUser(req, res, user)
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while adding the user' })
    }
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body
    const user = await db.helpers.checkIdentification(username)
    if (!user) {
        return res.status(404).json({ error: 'Invalid username or email' })
    }
    if (!(await db.helpers.checkPassword(username, password))) {
        return res.status(401).json({ error: 'Invalid password' })
    }
    delete user.password
    await authenticateUser(req, res, user)
})


// Recipes
app.get('/recipes', async (req, res) => {
    try {
        let p = await db.helpers.getRecipes()
        res.json(p)
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching recipes' })
    }
})

app.get('/recipes/:id', async (req, res) => {
    try {
        let id = req.params.id
        let p = await db.helpers.getRecipeById(id)
        res.json(p)
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching the recipe' })
    }
})

app.post('/recipes', authMiddleware, async (req, res) => {
    try {
        const { title, chinTitle, cuisine, username, prepTime, cookTime, servings, picture, createdOn, timeLastModified, ingredients, recipeInstructions } = req.body
        const recipe = await db.helpers.addRecipe(title, chinTitle, cuisine, username, prepTime, cookTime, servings, picture, createdOn, timeLastModified, ingredients, recipeInstructions)
        const followers = await db.helpers.getFollowers(username)
        for (let follower of followers) {
            await db.helpers.addNotification(follower.follower, recipe.rid)
        }
        res.status(200).json({ message: 'Recipe added successfully' })
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while adding the recipe' })
    }
})

app.delete('/recipes/:id', authMiddleware, async (req, res) => {
    try {
        let id = req.params.id
        let recipe = await db.helpers.getRecipeById(id)
        if (recipe.username !== req.user.username) {
            return res.status(403).json({ error: 'You are not authorized to delete this recipe' })
        }
        await db.helpers.deleteById(id)
        res.json({ message: 'Recipe deleted successfully' })
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while deleting the recipe' })
    }
})

app.put('/recipes/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params
        let recipe = await db.helpers.getRecipeById(id)
        if (recipe.username !== req.user.username) {
            console.log('User is not authorized to update this recipe')
            console.log(recipe.username)
            console.log(req.user.username)
            return res.status(403).json({ error: 'You are not authorized to update this recipe' })
        }
        const { title, chinTitle, cuisine, username, prepTime, cookTime, servings, picture, createdOn, timeLastModified, ingredients, recipeInstructions } = req.body
        await db.helpers.updateById(id, title, chinTitle, cuisine, username, prepTime, cookTime, servings, picture, createdOn, timeLastModified, ingredients, recipeInstructions)
        res.json({ message: 'Recipe updated successfully' })
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while updating the recipe' })
    }
})

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
        const likes = await db.helpers.getLikes(username)
        res.json(likes)
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching likes' })
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