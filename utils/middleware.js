const logger = require('../utils/logger')
const User = require('../models/user_model')
const jwt = require('jsonwebtoken')

const requestLogger = (request, response, next) => {
    logger.info('Method',request.method)
    logger.info('Path',request.path)
    logger.info('Body',request.body)
    logger.info('------------------')
    next()
}

const errorHandler = (error,request,response) => {
    logger.error(error.message)
    return response.status(400).json({error: error.message})
    
}
const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.startsWith('Bearer ')) {
        return authorization.replace('Bearer ','')
    }
    return null
}   

const tokenExtractor = async (request,response,next) => {
    try{
        const token = getTokenFrom(request)

        const decodedToken = jwt.verify(token, process.env.SECRET)
        if (!decodedToken.id) {
            return response.status(401).json({error : 'token invalid'})
        }

        const user = await User.findById(decodedToken.id)
        // const user = await User.findById(body.userId)
        if (!user) { 
            return response.status(404).json({ error: 'User not found' }) 
        }
        request.user=user
        next()
    } catch (error) { 
        next(error)
    }
}
const unknownEndpoint = (request,response) =>{
    response.status(404).json({error: 'unknown Endpoint'})
}

module.exports = {
    requestLogger,
    errorHandler,
    unknownEndpoint,
    tokenExtractor
}