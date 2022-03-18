const mongoose = require('mongoose')
const {Schema, model} = mongoose
//schemas
const userSchema = new Schema({
    name: String,
    username: {type: String, unique: true},
    passwordHash: String,
    role: String,
    date: Date,
    notes: [{
        type: Schema.Types.ObjectId,
        ref: 'Note'
    }]
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

const User = model('User', userSchema) //poner modelo en singular mongo detecta y lo cambia a plural
module.exports = User

// probando crear usuario
// const user = new User({
//     name: "User de Prueba",
//     username: "user1",
//     password: "primerusuario",
//     role: "user",
//     date: new Date()
// })
// user.save()
// .then(response => {
//     console.log(response)
//     mongoose.connection.close()
// })
// .catch(error => {
//     console.log(error)
//     mongoose.connection.close()
// })