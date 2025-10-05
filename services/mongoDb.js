const mongoose = require('mongoose')
const { MONGODB_URI } = require('../utils/config')
const logger = require('../utils/logger')

const url = MONGODB_URI

const initializeMongoConnection = async () => {
  mongoose.set('strictQuery', false)

  try {
    await mongoose.connect(url)
    logger.info('connected to MongoDB')
  } catch (error) {
    logger.error('error connecting to MongoDB', error.message)
  }
}

module.exports = { initializeMongoConnection }