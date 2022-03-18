const usersRouter = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')

usersRouter.get('/', (req, res) => {
    User.find({}).populate("notes", {
        content: 1,
        important: 1,
        date: 1
    })
    .then(users => res.json(users))
})

usersRouter.get('/:id', (req, res, next) => {
    const {id} = req.params
    User.findById(id).then(user => {
       user ? res.send(user)
       : res.status(404).end()
    }).catch((error) => {
        next(error)
    })
})

usersRouter.post('/', async(req, res, next) => {
const {body} = req

if(!body.name || !body.password || !body.username) {
    return res.status(400).json({
        error : 'a require field is missing'
    })
}

const {username, name, password} = body
const passwordHash = await bcrypt.hash(password, 10)

const newUser = new User({
    name,
    username,
    passwordHash,
    role: body.role ?? "user",
    date: new Date()
})

newUser.save()
.then(savedUser => res.status(201).json(savedUser))
.catch(error => next(error))

})

usersRouter.put('/:id', (req, res, next) => {
    const {id} = req.params
    const {body} = req
    const {username, name, password, role} = body
    const updateUser = { 
    name,
    username,
    passwordHash: password,
    role
    }

    User.findByIdAndUpdate(id, updateUser, {new : true})
    .then(result => {
        res.json(result)
    }).catch(error => next(error))
})

usersRouter.delete('/:id', (req, res, next) => {
    const {id} = req.params
    User.findByIdAndDelete(id)
    .then(result => {
    result ? res.status(204).end()
    : res.status(404).end()
    }).catch(error => next(error))
  
})

module.exports = usersRouter