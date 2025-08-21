const User = require('../models/user')
const userrouter = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const { info, error } = require('../utils/logger')

userrouter.get('/',async(request,response)=>{
  const users = await User.find({}).populate('blogs',{title:1,author:1,url:1,likes:1})
  response.send(users)
})

userrouter.post('/login',async(request,response,next)=>{
  const {username,password} = request.body
  const user = await User.findOne({username:username})
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return response.status(401).send({
      success: false,
      error: {
        code: "AUTHENTICATION_FAILED",
        message: "username or password is incorrect"
      }
    });
  }
  
  const tokendata = {
    username:user.username,
    userid:user._id
  }
  const token = jwt.sign(tokendata,process.env.SECRET)
  response.status(200).send({
    "success":true,
    "message":"login successful",
    "token":token
  })
})

userrouter.post('/create',async(request,response,next)=>{
  const {name,username,password} = request.body
  if(!password){
    return response.status(400).send({
    "success": false,
    "error": {
      "code": "INVALID_CREDENTIALS",
      "message": "password must be given."
    }
})
  }
  if(password.length <= 3){
    return response.status(400).send({
    "success": false,
    "error": {
      "code": "INVALID_CREDENTIALS",
      "message": "the password must be more than 3 charecters long."
  }
})
  }
  const created_pass_hash = await bcrypt.hash(password,10)
  const newuser = new User({
    name:name,
    username:username,
    passwordHash:created_pass_hash
  })
  try {
    const createduser = await newuser.save()
    response.status(200).send(createduser)
  } catch (error) {
    next(error)
  }
})

module.exports = userrouter