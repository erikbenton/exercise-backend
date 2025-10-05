const express = require('express')
const mongoService = require('./services/mongoDb')
const middleware = require('./utils/middleware')
const exercisesRouter = require('./controllers/exercises')
const listsRouter = require('./controllers/lists')

const app = express()
app.use(express.json())
app.use(middleware.requestLogger)

mongoService.initializeMongoConnection()

app.use('/api/exercises', exercisesRouter)
app.use('/api/lists', listsRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app