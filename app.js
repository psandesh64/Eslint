const express = require('express')
const app = express()
const {MONGO_URL} = require('./utils/config')
const logger = require('./utils/logger')
const {requestLogger, errorHandler, unknownEndpoint} = require('./utils/middleware')
const mongoose = require('mongoose')
const blog_router = require('./controller/blog_router')
const user_router = require('./controller/user_router')
const login_router = require('./controller/login_router')

mongoose.connect(MONGO_URL)
    .then(() => logger.info('Connected to MongoDB'))
    .catch((error) => logger.error('error connecting to MongoDB: ', error.message))

app.use(express.json())
app.use(requestLogger)

app.use('/api',blog_router)
app.use('/api',user_router)
app.use('/api',login_router)

app.use(errorHandler)
app.use(unknownEndpoint)
module.exports = app