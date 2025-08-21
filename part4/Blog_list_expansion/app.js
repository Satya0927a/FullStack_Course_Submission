const express = require('express')
const mongoose = require('mongoose')
const blogsrouter = require('./controller/blogs')
const {info,error} = require('./utils/logger')
const { URI } = require('./utils/config')
const userrouter = require('./controller/User')
const jwt = require('jsonwebtoken')
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
//token extractor middleware
const tokenextractor = (req,res,next)=>{
  const auth = req.get('Authorization')
  if(auth && auth.toLowerCase().startsWith('bearer ')){
    req.token = auth.substring(7)
  }
  else{
    req.token = null
  }
  next()
}
app.use(tokenextractor)

//user exctractor middleware
const userextractor = (req,res,next)=>{
  const tokendecoded = jwt.verify(req.token,process.env.SECRET)
  req.user = tokendecoded
  next()
}

app.use('/api/blogs',userextractor,blogsrouter)
app.use('/api/user',userrouter)

//errorhandler middleware
const erroHandler = (error,req,res,next)=>{
  info(error)
  if(error.name === 'ValidationError'){
    res.status(400).send(error.message)
  }
  else if(error.name === "MongooseError"){
    res.status(400).send(error.message)
  }
  else if(error.name === "TypeError" || error.name === 'JsonWebTokenError'){

    res.status(401).send("Invalid token or token missing")
  }
  else{
    res.status(500).send("server side error")
  }
}

app.use(erroHandler)

module.exports = app