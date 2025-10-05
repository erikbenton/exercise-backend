const { MONGODB_URI } = require('./utils/config')
const mongoose = require('mongoose')
const Exercise = require('./models/exercise')

const url = MONGODB_URI

mongoose.set('strictQuery', false)

mongoose.connect(url)

const exercise = new Exercise({
  name: 'barbell bench press',
  bodyPart: 'chest',
  equipment: 'barbell',
  instructions: [
    'Step:1 Lie flat on a bench with your feet flat on the ground and your back pressed against the bench.',
    'Step:2 Grasp the barbell with an overhand grip slightly wider than shoulder-width apart.',
    'Step:3 Lift the barbell off the rack and hold it directly above your chest with your arms fully extended.',
    'Step:4 Lower the barbell slowly towards your chest, keeping your elbows tucked in.',
    'Step:5 Pause for a moment when the barbell touches your chest.',
    'Step:6 Push the barbell back up to the starting position by extending your arms.',
    'Step:7 Repeat for the desired number of repetitions.'
  ]
})

exercise.save().then(result => {
  console.log('saved exercise!', exercise)
  mongoose.connection.close()
})

