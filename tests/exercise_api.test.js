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
    const request = await api
      .get('/api/exercises')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert(request.body.length === helper.initialExercises.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})