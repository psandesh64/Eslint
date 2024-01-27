const router = require('express').Router()
const User = require('../models/user_model')
const bcrypt = require('bcrypt')

router.get('/user',async (request, response, next) => {
    try{
        const users = await User.find({}).populate('blogs',{title:1})
        response.json(users)
    } catch (error) {
        next(error)
    }
})

router.post('/user',async (request, response, next) => {
    try{
        const { username, name, password} = request.body

        if (password.length < 3) {
            return response.status(400).json({ error: 'Password must be at least 3 characters long' })
        }
        const saltRounds = 10
        const passwordHash = await bcrypt.hash(password,saltRounds)

        const user = new User({ username, name, passwordHash})
        const savedUser = await user.save()

        response.json(savedUser)
    } catch (error) {
        next(error)
    }
})
module.exports = router