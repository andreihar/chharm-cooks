const jwt = require('jsonwebtoken')
require('dotenv').config({ path: './process.env' })
const secretKey = process.env.JWT_SECRET_KEY

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

module.exports = { authMiddleware, authenticateUser }