require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()

app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())

morgan.token('data', (req, res) => {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :response-time ms :data'))

const generateId = () => {
  return Math.floor(Math.random() * Math.floor(100000));
}

app.get('/info', (req, res) => {
  const date = new Date()
  const html = `
    <p>Phonebook has info for ${persons.length} people<p>
    <p>${date}</p>
  `
  res.send(html)
})

app.get('/api/persons', (req, res) => {
  Person.find({}).then(persons => {
    res.json(persons.map(p => p.toJSON()))
  })
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)

  if(person){
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.post('/api/persons', (req, res) => {
  const body = req.body
  const regex = new RegExp(body.name, "i")

  if(!body.name || !body.number) {
    return res.status(400).json({
      error: "required information missing!"
    })
  }

  if(persons.filter(p => p.name.search(regex) === 0).length > 0){
    return res.status(400).json({
      error: "name must be unique"
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  persons = persons.concat(person)

  res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
