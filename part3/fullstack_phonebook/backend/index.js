const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(cors())

var persons = [
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
app.use(express.json())
app.use(morgan('tiny'))
morgan.token('type', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':type'))
app.use(express.static('dist'))


app.get('/api/persons',(req,res)=>{
    res.json(persons)
})

app.get('/api/persons/:id',(req,res)=>{
    const req_id = req.params.id
    const requested_person = persons.find(person=>person.id == req_id)
    
    if(requested_person){
        res.json(requested_person)
    }
    else{
        res.status(204).send("Error:204 person not found")
    }
})

app.delete('/api/persons/:id',(req,res)=>{
    const req_id = req.params.id
    const new_data = persons.filter(person=>person.id !== req_id)
    persons = new_data
    // console.log(new_data);
    

    res.status(204).end()
})

app.post('/api/persons', (req, res) => {
    const body = req.body;

    if(!body.name){
        return res.status(400).json({error:"name is missing"})
    }
    if(!body.number){
        return res.status(400).json({error:"number is missing"})
    }

    const gen_id = (Math.floor(Math.random() * (1000 - 100 + 1)) + 100).toString();

    const newdata = {
        name: body.name,
        number: body.number,
        id: gen_id
    };

    persons = persons.concat(newdata);
    res.status(201).json(newdata);
    
})

app.get('/api/info',(req,res)=>{
    res.send(`Phonebook has info for ${persons.length} <br> ${new Date()}`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT,()=>{
    console.log('app is listening in port',PORT);
    
})