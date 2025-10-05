const listsRouter = require('express').Router()
const bodyParts = require('../data/bodyParts')
const equipment = require('../data/equipment')

listsRouter.get('/bodyParts', (request, response) => {
  response.send(bodyParts)
})

listsRouter.get('/equipment', (request, response) => {
  response.send(equipment)
})

module.exports = listsRouter