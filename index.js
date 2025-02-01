const express = require('express')
const app = express()

app.use(express.json())

let persons = [
    {
        "id": "1",
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": "2",
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": "3",
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": "4",
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

//api for all persons objects
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    let personsCuantity = persons.length
    let requestTime = new Date(Date.now())

    response.send(
            `<p>The phonebook has stored the info of ${personsCuantity} persons</p><p>${requestTime}</p>`
    )
})


app.get('/api/persons/:id', (request, response) => {
    let id = request.params.id
    let person = persons.find(p => p.id === id)
    person ?
    response.json(person) :
    response.status(404).send('Id not found in the database')
})

app.delete('/api/persons/:id', (request, response) => {
    let id = request.params.id
    persons = persons.filter(p => p.id !== id)

    response.status(204).end()
})

const getRandomID = () => {
    return Math.floor(Math.random() * 10000); //numbers floored, max value is 10000
  }

app.post('/api/persons', (request, response) => {
    let newPerson = {
        id: String(getRandomID()),
        name: request.body.name,
        number: request.body.number
    }
    persons = persons.concat(newPerson)
    response.json(newPerson)

})


const PORT = 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
