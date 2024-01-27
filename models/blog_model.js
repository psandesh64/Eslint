const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})
blogSchema.set('toJSON',{
    transform: (doc,ret) => {
        delete ret.__v
    }
})
const Blog = mongoose.model('Blog',blogSchema)
module.exports = Blog