const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())
app.use(express.json()) //bodyparser

require('dotenv').config()
require('./database/connect') 
const User = require('./models/User')
const notFound = require('./middleware/notFound')
const handleErrors = require('./middleware/handleErrors')
const notesRouter = require('./controllers/notes')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')

app.get('/', (req, res) => {
    res.json({server : "on"})
})

app.use('/api/notes', notesRouter)

app.use('/api/users', usersRouter)

app.use('/api/login', loginRouter)

app.use(notFound)

app.use(handleErrors)

//iniciar server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`servidor andando en: ${PORT}`)
})