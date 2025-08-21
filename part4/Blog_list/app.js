require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const blogsrouter = require('./controller/blogs')
const {info,error} = require('./utils/logger')
const { MONGO_URI } = require('./utils/config')
const app = express()

mongoose.connect(MONGO_URI).then(()=>{
  info('connected to the database');
  
}).catch(err=>{
  error('could not connect to the database',err.data);
  
})

app.use(express.json())

app.use('/api/blogs',blogsrouter)


module.exports = app