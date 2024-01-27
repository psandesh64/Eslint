const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength:3,
        unique: true
    },
    name: String,
    passwordHash: String,
    blogs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    }]
})
userSchema.plugin(uniqueValidator)
userSchema.set('toJSON',{
    transform: (doc,ret) => {
        delete ret.__v
        delete ret.passwordHash
    }
})
const User = mongoose.model('User', userSchema)

module.exports = User