const express = require('express')
const mongoService = require('./services/mongoDb')
const Exercise = require('./models/exercise')
const bodyParts = require('./data/bodyParts')
const equipment = require('./data/equipment')

const app = express()

mongoService.initializeMongoConnection()

app.get('/', (request, response) => {
  response.send('<h1>Exercise backend</h1>')
})

app.get('/api/exercises', async (request, response) => {
  const exercises = await Exercise.find({})
  response.send(exercises)
})

app.get('/api/bodyPartsList', (request, response) => {
  response.send(bodyParts)
})

app.get('/api/equipmentList', (request, response) => {
  response.send(equipment)
})

module.exports = app