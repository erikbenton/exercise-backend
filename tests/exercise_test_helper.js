const Exercise = require('../models/exercise')
const { v4 } = require('uuid')

const initialExercises = [
  {
    name: 'dumbbell alternate biceps curl',
    description: null,
    bodyPart: 'upper arms',
    equipment: 'dumbbell',
    instructions: [
      { content: 'Stand up straight with a dumbbell in each hand, palms facing forward and arms fully extended.'},
      { content: 'Keeping your upper arms stationary, exhale and curl the weights while contracting your biceps.'},
      { content: 'Continue to raise the dumbbells until your biceps are fully contracted and the dumbbells are at shoulder level.'},
      { content: 'Hold the contracted position for a brief pause as you squeeze your biceps.'},
      { content: 'Inhale and slowly begin to lower the dumbbells back to the starting position.'},
      { content: 'Repeat for the desired number of repetitions, alternating arms.'}
    ]
  },
  {
    name: 'barbell bench press',
    description: null,
    bodyPart: 'chest',
    equipment: 'barbell',
    instructions: [
      { content: 'Lie flat on a bench with your feet flat on the ground and your back pressed against the bench.'},
      { content: 'Grasp the barbell with an overhand grip slightly wider than shoulder-width apart.'},
      { content: 'Lift the barbell off the rack and hold it directly above your chest with your arms fully extended.'},
      { content: 'Lower the barbell slowly towards your chest, keeping your elbows tucked in.'},
      { content: 'Pause for a moment when the barbell touches your chest.'},
      { content: 'Push the barbell back up to the starting position by extending your arms.'},
      { content: 'Repeat for the desired number of repetitions.'}
    ]
  },
  {
    name: 'pull up',
    description: null,
    bodyPart: 'back',
    equipment: 'body weight',
    instructions: [
      { content: 'Hang from a pull-up bar with a neutral grip (palms facing each other) and your arms fully extended.'},
      { content: 'Engage your core and squeeze your shoulder blades together.'},
      { content: 'Pull your body up towards the bar by bending your elbows and driving your elbows down towards your hips.'},
      { content: 'Continue pulling until your chin is above the bar.'},
      { content: 'Pause for a moment at the top, then slowly lower your body back down to the starting position with control.'},
      { content: 'Repeat for the desired number of repetitions.'}
    ]
  }
]

const exercisesInDb = async () => {
  const exercises = await Exercise.find({})
  return exercises.map(e => e.toJSON())
}

const nonExistingId = async () => {
  const exercise = new Exercise({
    ...initialExercises[0]
  })
  await exercise.save()
  await exercise.deleteOne()

  return exercise._id.toString()
}

module.exports = {
  initialExercises,
  exercisesInDb,
  nonExistingId
}