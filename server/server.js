const express = require("express")
const cors = require("cors")
const db = require("./db")

const app = express()

app.use(express.json())
app.use(cors())

app.get('/getusers', async (req, res) => {
    let p = await db.helpers.getUsers()
    res.json(p)
})

app.post('/adduser', async (req, res) => {
    let username = req.body.name
    let password = req.body.password

    await db.helpers.addUser(username, password)
    res.redirect('/getusers')
})

app.listen(4000, () => console.log("Server is running on port 4000"))