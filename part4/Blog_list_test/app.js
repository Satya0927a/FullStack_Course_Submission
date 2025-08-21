const express = require('express')
const mongoose = require('mongoose')
const blogsrouter = require('./controller/blogs')
const {info,error} = require('./utils/logger')
const { URI } = require('./utils/config')
const app = express()

mongoose.connect(URI).then(()=>{
  if(process.env.NODE_ENV === 'test'){
    info(`connected to the Test database`);
  }
  else{
    info('connected to the production database')
  }
  
}).catch(err=>{
  error('could not connect to the database',err.data);
  
})

app.use(express.json())

app.use('/api/blogs',blogsrouter)

const erroHandler = (error,req,res,next)=>{
  if(error.name === 'ValidationError'){
    res.status(500).send(error)
  }
}

app.use(erroHandler)

module.exports = app