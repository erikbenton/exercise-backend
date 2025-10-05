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
})

after(async () => {
  await mongoose.connection.close()
})