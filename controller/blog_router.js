const router = require('express').Router()
const Blog = require('../models/blog_model')
const {tokenExtractor} = require('../utils/middleware')

router.get('/blogs', (request,response) => {
    Blog.find({}).populate('user',{username:1})
        .then(results => response.json(results))
})

router.post('/blogs', tokenExtractor, async(request,response,next) => {
    try {
        const postedBody = request.body
        const user = request.user
        const blog = new Blog({
            ...postedBody,
            user: user._id,
        })

        const savedBlog = await blog.save()
        user.blogs = user.blogs.concat(savedBlog._id)
        await user.save()

        response.status(201).json(savedBlog)
    } catch (error) {
        next(error)
    }
})

router.delete('/blogs/:id',tokenExtractor,async (request,response,next) => {
    try{
        const blog = await Blog.findById(request.params.id)
        const toDelete = request.user._id.toString() === blog.user._id.toString()
            ? request.params.id : undefined
        console.log(blog,toDelete,request.user._id,blog.user._id)
        const deletedBlog = await Blog.findByIdAndDelete(toDelete)
        if (deletedBlog){
            return response.status(204).end()
        }
        return response.status(404).json({error: 'Blog id not found'})
    } catch (error) {
        next(error)
    }
})
router.put('/blogs/:id', async (request, response, next) => {
    try{
        const updated_id = request.params.id
        const obj = await Blog.findOne({_id: updated_id})
        console.log(obj)
        if (!obj) {
            return response.status(400).json({error: 'blog id not found'})
        }
        const newBlog= await Blog.findByIdAndUpdate(updated_id,
            {$set: {
                likes:obj.likes+1}
            },
            {new: true})
        return response.status(200).json(newBlog)
    } catch (error) { next(error) }
})

module.exports = router
