require("dotenv").config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require("./models/person")
const app = express()

//defining a new morgan token for exercise 3.8
morgan.token('request-body', (req, res) => {
    return JSON.stringify(req.body)
})

app.use(express.static('dist'))
app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms --- :request-body'))

// let persons = [
//     {
//         "id": "1",
//         "name": "Arto Hellas",
//         "number": "040-123456"
//     },
//     {
//         "id": "2",
//         "name": "Ada Lovelace",
//         "number": "39-44-5323523"
//     },
//     {
//         "id": "3",
//         "name": "Dan Abramov",
//         "number": "12-43-234345"
//     },
//     {
//         "id": "4",
//         "name": "Mary Poppendieck",
//         "number": "39-23-6423122"
//     }
// ]


app.get('/api/persons', (request, response) => {//api for all persons objects
    Person.find({})
        .then(persons => {
            response.json(persons)
        })
        .catch(error => {
            response.send(`Error ocurred while getting de info. Error: ${error.message}`)
        })
})

app.get('/info', (request, response) => {
    let persons;
    Person.find({})
        .then(personsReceived => {
            persons = personsReceived
            let personsCuantity = persons.length
            let requestTime = new Date(Date.now())

            response.send(
                `<p>The phonebook has stored the info of ${personsCuantity} persons</p><p>${requestTime}</p>`
            )
        })
        .catch(error => {
            response.send(`Error ocurred while getting de info. Error: ${error.message}`)
        })

})


app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            response.json(person)
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
   Person.findByIdAndDelete(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

// const getRandomID = () => {
//     return Math.floor(Math.random() * 10000); //numbers floored, max value is 10000
//   }

app.post('/api/persons', (request, response) => {

    if (!request.body.name) {
        return response.status(400).json({ error: 'Name is required' })
    }
    if (!request.body.number) {
        return response.status(400).json({ error: 'Number is required' })
    }
    let persons
    Person.find({})
        .then(personsArray => {
            let validation = personsArray.find(person => person.name === request.body.name)
            if (validation) {
                return response.status(400).json({ error: 'Name already added in the phonebook' })
            }

            let newPerson = new Person({
                name: request.body.name,
                number: request.body.number
            })
            
            newPerson.save()
                .then(person => response.json(person))
        })
        .catch(error => response.status(400).json({ error: "An error ocurred while posting a new Person", message: error.message }))

})

//error handler middleware
const errorHandler = (error, request, response, next) => {
    if(error.name === 'CastError'){
        response.status(400).send(`Error: Malformatted id`)
    }

    next(error)
}
//use error handler middleware
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
