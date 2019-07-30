const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const app = express()

app.use(bodyParser.json())
app.use(morgan('tiny'))

 let persons = [
  {
    "name": "Ada Lovelace",
    "number": "123123123",
    "id": 2
  },
  {
    "name": "Mary Poppendieck",
    "number": "39-23-6423122",
    "id": 4
  },
  {
    "name": "Herra Hubert",
    "number": "030 123123",
    "id": 5
  },
  {
    "name": "Dave Davidson",
    "number": "123123",
    "id": 6
  }
]

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
  res.json(persons)
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



const port = 3001
app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
