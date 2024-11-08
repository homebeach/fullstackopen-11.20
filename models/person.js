import mongoose from 'mongoose'

const personSchema = new mongoose.Schema({
  content: {
    type: String,
    minlength: 3,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: function (value) {
        const phoneRegex = /^\d{2,3}-\d{5,}$/
        return phoneRegex.test(value)
      },
      message: 'Invalid phone number format'
    },
    required: true
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Person = mongoose.model('Person', personSchema)
export default Person
