const Exercise = require('../models/exercise')

const initialExercises = [
  {
    name: 'dumbbell alternate biceps curl',
    bodyPart: 'upper arms',
    equipment: 'dumbbell',
    instructions: [
      'Step:1 Stand up straight with a dumbbell in each hand, palms facing forward and arms fully extended.',
      'Step:2 Keeping your upper arms stationary, exhale and curl the weights while contracting your biceps.',
      'Step:3 Continue to raise the dumbbells until your biceps are fully contracted and the dumbbells are at shoulder level.',
      'Step:4 Hold the contracted position for a brief pause as you squeeze your biceps.',
      'Step:5 Inhale and slowly begin to lower the dumbbells back to the starting position.',
      'Step:6 Repeat for the desired number of repetitions, alternating arms.'
    ]
  },
  {
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
  },
    {
    name: 'pull up',
    bodyPart: 'back',
    equipment: 'body weight',
    instructions: [
      'Step:1 Hang from a pull-up bar with a neutral grip (palms facing each other) and your arms fully extended.',
      'Step:2 Engage your core and squeeze your shoulder blades together.',
      'Step:3 Pull your body up towards the bar by bending your elbows and driving your elbows down towards your hips.',
      'Step:4 Continue pulling until your chin is above the bar.',
      'Step:5 Pause for a moment at the top, then slowly lower your body back down to the starting position with control.',
      'Step:6 Repeat for the desired number of repetitions.'
    ]
  }
]

const exercisesInDb = async () => {
  const exercises = await Exercise.find({})
  return exercises.map(e => e.toJSON())
}

const nonExistingId = async () => {
  const exercise = initialExercises[0]
  await exercise.save()
  await exercise.deleteOne()

  return exercise._id.toString()
}

module.exports = {
  initialExercises,
  exercisesInDb,
  nonExistingId
}