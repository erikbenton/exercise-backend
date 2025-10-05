const express = require('express')
const mongoService = require('./services/mongoDb')
const Exercise = require('./models/exercise')
const bodyParts = require('./data/bodyParts')
const equipment = require('./data/equipment')
const middleware = require('./utils/middleware')

const app = express()
app.use(express.json())
app.use(middleware.requestLogger)

mongoService.initializeMongoConnection()

app.get('/api/exercises', async (request, response) => {
  const exercises = await Exercise.find({})
  response.json(exercises)
})

app.get('/api/exercises/name/:name', async (request, response) => {
  const name = request.params.name
  const searchName = new RegExp(name, 'i')
  const exercises = await Exercise.find({ name: searchName}).exec()
  response.send(exercises)
})

app.get('/api/exercises/:id', async (request, response) => {
  const id = request.params.id
  const exercise = await Exercise.findById(id)

  if (exercise) {
    response.json(exercise)
  } else {
    response.status(404).end()
  }
})

app.post('/api/exercises', async (request, response) => {
  const { name, description, bodyPart, equipment, instructions } = request.body
  const exercise = new Exercise({
    name,
    description,
    bodyPart,
    equipment,
    instructions
  })

  const savedExercise = await exercise.save()
  response.status(201).json(savedExercise)
})

app.get('/api/bodyPartsList', (request, response) => {
  response.send(bodyParts)
})

app.get('/api/equipmentList', (request, response) => {
  response.send(equipment)
})

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app