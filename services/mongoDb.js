const mongoose = require('mongoose')
const { MONGODB_URI } = require('../utils/config')

const url = MONGODB_URI

const initializeMongoConnection = async () => {
  mongoose.set('strictQuery', false)

  try {
    await mongoose.connect(url)
    console.log('connected to MongoDB')
  } catch (error) {
    console.error('error connecting to MongoDB', error.message)
  }
}

module.exports = { initializeMongoConnection }