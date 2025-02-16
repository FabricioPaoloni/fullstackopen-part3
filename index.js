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

app.use(express.json())
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms --- :request-body'))
app.use(express.static('dist'))

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


app.get('/api/persons/:id', (request, response) => {
    Person.findById(request.params.id)
        .then(person => {
            response.json(person)
        })
        .catch(error => response.status(400).send("Error ocurred while getting the person. Error:", error.message))
    // let person = persons.find(p => p.id === id)
    // person ?
    // response.json(person) :
    // response.status(404).send('Id not found in the database')
})

app.delete('/api/persons/:id', (request, response) => {
    let id = request.params.id
    persons = persons.filter(p => p.id !== id)

    response.status(204).end()
})

// const getRandomID = () => {
//     return Math.floor(Math.random() * 10000); //numbers floored, max value is 10000
//   }

app.post('/api/persons', (request, response) => {

    if(!request.body.name){
        return response.status(400).json({error: 'Name is required'})
    }
    if(!request.body.number){
        return response.status(400).json({error: 'Number is required'})
    }
    let validation = persons.find(person => person.name === request.body.name)
    if(validation){
        return response.status(400).json({error: 'Name already added in the phonebook'})
    }


    let newPerson = {
        id: String(getRandomID()),
        name: request.body.name,
        number: request.body.number
    }
    persons = persons.concat(newPerson)
    response.json(newPerson)

})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
