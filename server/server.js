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
app.get('/getusers', async (req, res) => {
    try {
        let p = await db.helpers.getUsers()
        res.json(p)
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching users' })
    }
})

app.get('/getuser/:username', async (req, res) => {
    try {
        let username = req.params.username
        let p = await db.helpers.getUserByName(username)
        res.json(p)
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching the user' })
    }
})

app.post('/adduser', async (req, res) => {
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
    const user = await db.helpers.getUserByName(username)
    if (!user) {
        return res.status(404).json({ error: 'Invalid username' })
    }
    if (!(await db.helpers.checkPassword(username, password))) {
        return res.status(401).json({ error: 'Invalid password' })
    }
    delete user.password
    await authenticateUser(req, res, user)
})


// Recipes
app.get('/getrecipes', async (req, res) => {
    try {
        let p = await db.helpers.getRecipes()
        res.json(p)
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching recipes' })
    }
})

app.post('/addrecipe', authMiddleware, async (req, res) => {
    try {
        const { title, chinTitle, cuisine, username, prepTime, cookTime, servings, picture, createdOn, timeLastModified, ingredients, recipeInstructions } = req.body
        await db.helpers.addRecipe(title, chinTitle, cuisine, username, prepTime, cookTime, servings, picture, createdOn, timeLastModified, ingredients, recipeInstructions)
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while adding the recipe' })
    }
})

app.get('/getrecipe/:id', async (req, res) => {
    try {
        let id = req.params.id
        let p = await db.helpers.getRecipeById(id)
        res.json(p)
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching the recipe' })
    }
})

app.delete('/deleterecipe/:id', authMiddleware, async (req, res) => {
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

app.put('/updaterecipe/:id', authMiddleware, async (req, res) => {
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

async function InitDB() {
    try {
        await db.helpers.init()
        app.listen(port, () => console.log(`server is running on port ${port}`))
    } catch (err) {
        console.log(err)
    }
}

InitDB()