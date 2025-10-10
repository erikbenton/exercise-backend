const mongoose = require('mongoose')
const bodyParts = require('../data/bodyParts')
const equipments = require('../data/equipment')

const instructionSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  }
})

instructionSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: null},
  bodyPart: {
    type: String, required: true, validate: function (v) {
      return bodyParts.indexOf(v) > -1
    }
  },
  equipment: {
    type: String, required: true, validate: function (v) {
      return equipments.indexOf(v) > -1
    }
  },
  instructions: {type: [instructionSchema], default: null }
})

exerciseSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model("Exercise", exerciseSchema)