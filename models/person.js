const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

mongoose.connect(process.env.MONGO_URI)
        .then(console.log("connected to DB"))
        .catch(error => console.log('Error at connecting to db:', error.message))

const personSchema = mongoose.Schema({
    name: {
      type: String,
      minLength: 3,
    },
    number: {
      type: String,
      minLength: 8,
      validate: {
        validator: function(someNumber) {
          let regex = /^(\d{2}|\d{3})-\d\d\d\d+$/
          return regex.test(someNumber)
        },
        message: 'Invalid number. Must be in the form 333-3333.. or 33-12345..'
      }
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

module.exports = mongoose.model('Person', personSchema)


