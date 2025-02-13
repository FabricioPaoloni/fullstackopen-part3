const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please introduce password')
    process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://paolonifabricio:${password}@practice.grcxm.mongodb.net/appPersons?retryWrites=true&w=majority&appName=practice`

mongoose.set('strictQuery', false)

mongoose.connect(url)

const personSchema = mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv[3] && process.argv[4]){
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
    })

    person.save().then(result => {
        console.log(`Added ${result.name} number: ${result.number} to phonebook`)
        mongoose.connection.close()
    })
} else{
    Person.find({}).then(result => {
        console.log(`phonebook:`)
        result.forEach(person => {
            console.log(`${person.name}  ${person.number}`)
        })
        mongoose.connection.close()
    })
}

