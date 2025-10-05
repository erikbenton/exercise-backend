const { MONGODB_URI } = require('./utils/config')
const mongoose = require('mongoose')
const Exercise = require('./models/exercise')
const helper = require('./tests/exercise_test_helper')

const url = MONGODB_URI

mongoose.set('strictQuery', false)

mongoose.connect(url)

Exercise.insertMany(helper.initialExercises)
  .then(() => {
    console.log('saved exercises!')
    mongoose.connection.close()
  })

