const { test, describe, after, beforeEach } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const mongoose = require('mongoose')
const Exercise = require('../models/exercise')
const helper = require('./exercise_test_helper')

const api = supertest(app)

describe('when there are exercises in the MongoDB', () => {
  beforeEach(async () => {
    await Exercise.deleteMany({})
    await Exercise.insertMany(helper.initialExercises)
  })

  test('all exercises can be retrieved from GET all', async () => {
    const response = await api
      .get('/api/exercises')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert(response.body.length === helper.initialExercises.length)
  })

  test('specific exercise can be GET by id', async () => {
    const exercisesInDb = await helper.exercisesInDb()
    const exerciseToGet = exercisesInDb[0]

    const response = await api
      .get(`/api/exercises/${exerciseToGet.id}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.deepStrictEqual(response.body, exerciseToGet)
  })

  test('GETting a specific exercise fails if it does not exist (404)', async () => {
    const exerciseIdNotInDb = await helper.nonExistingId()

    await api
      .get(`/api/exercises/${exerciseIdNotInDb}`)
      .expect(404)
  })

  test('GETting a specific exercise with invalid id fails with status code 400', async () => {
    const invalidId = 1234

    await api
      .get(`/api/exercises/${invalidId}`)
      .expect(400)
  })

  test('exercises can be GET by name', async () => {
    const exerciseToGet = helper.initialExercises[0]
    const response = await api
      .get(`/api/exercises/name/${exerciseToGet.name}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const exerciseNames = response.body.map(e => e.name)
    assert(exerciseNames.includes(exerciseToGet.name))
  })

  test('valid exercise can be created', async () => {
    const exercise = {
      name: 'machine horizontal rows',
      description: 'Horizontal rows using a machine with a pulley system.',
      bodyPart: 'back',
      equipment: 'machine'
    }

    const response = await api
      .post('/api/exercises')
      .send(exercise)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const exercisesAfterPost = await helper.exercisesInDb()
    const exerciseIds = exercisesAfterPost.map(e => e.id)

    assert.strictEqual(exercisesAfterPost.length, helper.initialExercises.length + 1)
    assert(exerciseIds.includes(response.body.id))
  })

  test('exercise with invalid body part cannot be created', async () => {
    const invalidExercise = {
      name: 'machine horizontal rows',
      description: 'Horizontal rows using a machine with a pulley system.',
      bodyPart: 'invalid',
      equipment: 'machine'
    }

    await api
      .post('/api/exercises')
      .send(invalidExercise)
      .expect(400)
  })

  test('exercise with invalid equipment cannot be created', async () => {
    const invalidExercise = {
      name: 'machine horizontal rows',
      description: 'Horizontal rows using a machine with a pulley system.',
      bodyPart: 'back',
      equipment: 'invalid'
    }

    await api
      .post('/api/exercises')
      .send(invalidExercise)
      .expect(400)
  })

  test('exercise can be DELETEd with valid id', async () => {
    const exercisesBeforeDelete = await helper.exercisesInDb()
    const exerciseToDelete = exercisesBeforeDelete[0]

    await api
      .delete(`/api/exercises/${exerciseToDelete.id}`)
      .expect(204)

    const exercisesAfterDelete = await helper.exercisesInDb()
    const idsInDb = exercisesAfterDelete.map(e => e.id)
    assert(!idsInDb.includes(exerciseToDelete.id))
  })

  test('an exercise can be updated with PUT', async () => {
    const exercisesBeforePut = await helper.exercisesInDb()
    const exerciseToUpdate = exercisesBeforePut[0]
    exerciseToUpdate.name = 'updated name'
    exerciseToUpdate.description = 'updated description'
    exerciseToUpdate.instructions = [{content: 'updated instructions'}]

    const response = await api
      .put(`/api/exercises/${exerciseToUpdate.id}`)
      .send(exerciseToUpdate)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const exercisesAfterPut = await helper.exercisesInDb()
    const idsInDb = exercisesAfterPut.map(e => e.id)
    assert.strictEqual(exercisesBeforePut.length, exercisesAfterPut.length)
    assert(idsInDb.includes(exerciseToUpdate.id))

    // the instruction ObjectIds get rewritten due to their nested behavior
    // so only the instruction contents are compared, removing their ObjectIds
    const updatedPutExercise = {
      ...exerciseToUpdate,
      instructions: null
    }
    const updatedResponseExercise = {
      ...response.body,
      instructions: null
    }
    const updatedPutInstructions = exerciseToUpdate.instructions.map(i => i.content)
    const updatedResponseInstructions = response.body.instructions.map(i => i.content)

    assert.deepStrictEqual(updatedPutExercise, updatedResponseExercise)
    assert.deepStrictEqual(updatedPutInstructions, updatedResponseInstructions)
  })
})

after(async () => {
  await mongoose.connection.close()
})