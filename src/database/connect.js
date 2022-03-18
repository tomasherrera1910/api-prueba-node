const mongoose = require('mongoose')
const connectionString = process.env.MONGO_DB_CONNECT

mongoose.connect(connectionString)
.then(() => {
    console.log('database connected')
})
.catch(error => {console.error(error)})

process.on('uncaughtException', error => {
    console.error(error)
    mongoose.disconnect()
  })