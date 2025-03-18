const express = require('express')
const app = express()
const cors = require('cors')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const hotelRouter = require('./controllers/hotels')
const siteRouter = require('./controllers/sites')
const tipRouter =require('./controllers/tips')
const plannerRouter = require('./controllers/planner')
const recommendationRouter = require('./controllers/recommendation')
const faqRouter = require('./controllers/faq')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('connecting to database')

mongoose.connect("mongodb+srv://sanjana:swapna528@cluster0.absjn.mongodb.net/trip?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use('/api/users',usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/hotel', hotelRouter)
app.use('/api/sites', siteRouter)
app.use('/api/tips/', tipRouter)
app.use('/api/', plannerRouter)
app.use('/api/',faqRouter)
app.use('/api/',recommendationRouter)
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app