const notesRouter = require('express').Router()
const Note = require('../models/Note')
const User = require('../models/User')
const userExtractor = require('../middleware/userExtractor')

notesRouter.get('/', (req, res) => {
    Note.find({}).populate("user",{
        username:1
    })
    .then(notes => res.json(notes))
})

notesRouter.get('/:id', (req, res, next) => {
    const {id} = req.params
    Note.findById(id).then(note => {
        note ? res.send(note)
        : res.status(404).end()
     }).catch((error) => {
         next(error)
     })
})

notesRouter.post('/', userExtractor, async(req, res, next) => {
    const {body, userId} = req
    const {content, important} = body 
    
    if(!content || !userId){
        return res.status(400).json({
            error: 'a content of the note is missing'
        })}

    const user = await User.findById(userId)
    
    const newNote = new Note({
        content,
        important: important ?? false,
        date: new Date(),
        user: user._id
    })
    try{
        const savedNote = await newNote.save()
        user.notes = user.notes.concat(savedNote._id)
        await user.save()

        res.status(201).json(savedNote)
    }catch(error){
        next(error)
    }
    
})

notesRouter.put('/:id', (req, res, next) => {
    const {id} = req.params
    const {body} = req
    const {content, important} = body
    const updateNote = { 
        content,
        important
    }

    User.findByIdAndUpdate(id, updateNote, {new : true})
    .then(result => {
        res.json(result)
    }).catch(error => next(error))
})

notesRouter.delete('/:id', (req, res, next) => {
    const {id} = req.params
    Note.findByIdAndDelete(id)
    .then(result => {
        result ? res.status(204).end()
        : res.status(404).end()
        }).catch(error => next(error))
})

module.exports = notesRouter