const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
require('dotenv').config
const Person = require('./models/mongo')
app.use(cors())

app.use(express.json())
app.use(morgan('tiny'))
morgan.token('type', function (req) { return JSON.stringify(req.body) })
app.use(morgan(':type'))
app.use(express.static('dist'))


app.get('/api/persons', (req, res, next) => {
  // res.json(persons)
  Person.find({}).then(data => {
    res.send(data)
  }).catch(error => {
    next(error)
  })
})

app.get('/api/persons/:id', (req, res, next) => {
  const req_id = req.params.id

  Person.findById(req_id).then(result => {
    if (result) {
      res.send(result)
    }
    else {
      res.status(404).end()
    }
  }).catch(error => {
    next(error)
  })
})

app.delete('/api/persons/:id', (req, res, next) => {
  const req_id = req.params.id

  Person.findByIdAndDelete(req_id).then(() => {
    res.status(204).json({ message: 'deleted the user' })

  }).catch(error => {
    next(error)
  })
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body

  new Person(body).save().then(data => {
    res.send(data)
  }).catch(error => {
    next(error)
  })

})

app.put('/api/persons/:id', (req, res, next) => {
  const targetid = req.params.id
  const up_number = req.body.number
  console.log(up_number)

  Person.findByIdAndUpdate(targetid, { number: up_number }, { new: true }).then(result => {
    res.send(result)
  }).catch(error => {
    next(error)
  })

})

app.get('/api/info', (req, res, next) => {
  Person.find({}).then(persons => {
    res.send(`Phonebook has info for ${persons.length} <br> ${new Date()}`)

  }).catch(error => {
    next(error)
  })
})

const errorHandler = (error, req, res, next) => {
  console.log(error)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'invalid id' })
  }
  else if (error.name === 'ValidationError') {
    return res.status(400).send(error)
  }
  next(error)
}



app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log('app is listening in port', PORT)
})