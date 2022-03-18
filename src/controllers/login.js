const bcrypt = require('bcrypt')
const { response } = require('express')
const loginRouter = require('express').Router()
const User = require('../models/User')
const jwt = require('jsonwebtoken')

loginRouter.post('/', async(req, res) => {
    const {body} = req
    const {username, password} = body

    const user = await User.findOne({username})
    
    const passwordCorrect = !user
        ? false
        : await bcrypt.compare(password, user.passwordHash)
    
    if(!(user && passwordCorrect)){
        return res.status(401).json({
            error : "invalid password or user"
        })
    }
    console.log(passwordCorrect)
        console.log(user)
    const userForToken = {
        id: user._id,
        username: user.username
    }
    const token = jwt.sign(userForToken, process.env.SECRET,
        {
            expiresIn : 60 * 60 * 24 * 3
        })
    
    res.send({
        name: user.name,
        username: user.username,
        token
    })
})

module.exports = loginRouter