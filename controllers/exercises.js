const exercisesRouter = require('express').Router()
const Exercise = require('../models/exercise')
const logger = require('../utils/logger')

exercisesRouter.get('/', async (request, response) => {
  const exercises = await Exercise.find({})
  response.json(exercises)
})

exercisesRouter.get('/name/:name', async (request, response) => {
  const name = request.params.name
  const searchName = new RegExp(name, 'i')
  const exercises = await Exercise.find({ name: searchName}).exec()
  response.send(exercises)
})

exercisesRouter.get('/:id', async (request, response) => {
  const id = request.params.id
  const exercise = await Exercise.findById(id)

  if (exercise) {
    response.json(exercise)
  } else {
    response.status(404).end()
  }
})

exercisesRouter.post('/', async (request, response) => {
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

exercisesRouter.delete('/:id', async (request, response) => {
  const id = request.params.id
  const deletedExercise = await Exercise.findByIdAndDelete(id)

  logger.info('Deleted', deletedExercise)
  response.status(204).end()
})

exercisesRouter.put('/:id', async (request, response) => {
  const id = request.params.id
  const { name, description, bodyPart, equipment, instructions } = request.body

  const exercise = await Exercise.findById(id)

  if (exercise) {
    exercise.name = name
    exercise.description = description
    exercise.bodyPart = bodyPart
    exercise.equipment = equipment
    exercise.instructions = instructions

    const savedExercise = await exercise.save()
    response.json(savedExercise)
  } else {
    response.status(404).end()
  }
})

module.exports = exercisesRouter
