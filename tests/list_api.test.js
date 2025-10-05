const { test, describe, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const bodyParts = require('../data/bodyParts')
const equipment = require('../data/equipment')
const mongoose = require('mongoose')

const api = supertest(app)

describe('lists for supporting models', () => {
  test('equipment list returns all values', async () => {
    const request = await api
      .get('/api/lists/equipment')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(request.body.length, equipment.length)
  })

  test('body parts list returns all values', async () => {
    const request = await api
      .get('/api/lists/bodyParts')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert.strictEqual(request.body.length, bodyParts.length)
  })
})

after(async () => {
  mongoose.connection.close()
})