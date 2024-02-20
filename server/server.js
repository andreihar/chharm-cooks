const express = require("express")
const cors = require("cors")
const db = require("./db")
const app = express()

app.use(express.json())
app.use(cors())
let port = 4000

// Users
app.get('/getusers', async (req, res) => {
    let p = await db.helpers.getUsers()
    res.json(p)
})

app.get('/getuser/:username', async (req, res) => {
    let username = req.params.username
    let p = await db.helpers.getUserByName(username)
    res.json(p)
})

app.post('/adduser', async (req, res) => {
    const { username, password, picture, social } = req.body;
    await db.helpers.addUser(username, password, picture, social)
    res.redirect('/getusers')
})


// Recipes
app.get('/getrecipes', async (req, res) => {
    let p = await db.helpers.getRecipes()
    res.json(p)
})

app.post('/addrecipe', async (req, res) => {
    const { title, chinTitle, cuisine, username, prepTime, cookTime, servings, picture, createdOn, timeLastModified, ingredients, recipeInstructions } = req.body;
    await db.helpers.addRecipe(title, chinTitle, cuisine, username, prepTime, cookTime, servings, picture, createdOn, timeLastModified, ingredients, recipeInstructions);
})

app.get('/getrecipe/:id', async (req, res) => {
    let id = req.params.id
    let p = await db.helpers.getRecipeById(id)
    res.json(p)
})

app.delete('/deleterecipe/:id', async (req, res) => {
    let id = req.params.id
    await db.helpers.deleteById(id)
})

app.put('/updaterecipe/:id', async (req, res) => {
    const { id } = req.params;
    const { title, chinTitle, cuisine, username, prepTime, cookTime, servings, picture, createdOn, timeLastModified, ingredients, recipeInstructions } = req.body;
    await db.helpers.updateById(id, title, chinTitle, cuisine, username, prepTime, cookTime, servings, picture, createdOn, timeLastModified, ingredients, recipeInstructions);
});

async function InitDB() {
    await db.helpers.init()
    const p = await db.helpers.getUsers()
    console.log(p)
    people = p
}

InitDB().then(() => { 
    app.listen(port, () => console.log(`server is running on port ${port}`) ) 
}).catch((err) => { console.log(err) })