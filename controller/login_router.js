const jwt = require('jsonwebtoken')
const bcrpyt = require('bcrypt')
const router = require('express').Router()
const User = require('../models/user_model')

router.post('/login', async (request,response,next) => {
    try{
        const {username,password} = request.body

        const user = await User.findOne({username})
        const passwordCorrect = user === null
            ? false
            : await bcrpyt.compare(password, user.passwordHash)

        if (!(user && passwordCorrect)) {
            return response.status(401).json({error: 'Invalid Username or Password'})
        }

        const userForToken = {
            username: user.username,
            id: user._id
        }

        // const token = jwt.sign(userForToken,process.env.SECRET)
        // token expires in 60*60 seconds,(i.e 1 hour)
        const token = jwt.sign(userForToken,process.env.SECRET,{expiresIn: 60*60})

        response.status(200)
            .send({
                token,
                username: user.username,
                name: user.name
            })
    } catch (error) {
        next(error)
    }
})

module.exports = router