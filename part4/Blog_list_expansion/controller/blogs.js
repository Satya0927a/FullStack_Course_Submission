const blogsrouter = require('express').Router()
const { request } = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const { info, error } = require('../utils/logger')
const jwt = require('jsonwebtoken')

// const gettoken = req=>{
//   const token = req.get('Authorization')
//   info(token)
//   return token.replace('Bearer ','')
// }

blogsrouter.get('/', async(request, response) => {
  const blogs = await Blog.find({}).populate('user',{name:1,username:1})
  response.send(blogs)
})

blogsrouter.post('/', async(request, response, next) => {
  var datarecieved = request.body
  if(!request.token){
    return response.status(401).send({error:"token missing or invalid"})
  }
  // const tokendecoded = jwt.verify(request.token,process.env.SECRET)
  const tokendecoded = request.user
  if(!tokendecoded){
    return response.status(401).send({
      "success":false,
      "error":{
        "code":"UNAUTHORIZED",
        "message":"you are not authorized for this action"
      }
    })
  }
  const user = await User.findById(tokendecoded.userid)
  // info(randomuser)
  // Always set user and likes (default to 0 if not provided)
  if(!user){
    return response.status(404).send({
      success:false,
      error:{
        code:"USER_NOTFOUND",
        message:"user not found"
      }
    })
  }
  datarecieved = {
    ...datarecieved,
    likes: datarecieved.likes || 0,
    user: user._id
  }
  info(datarecieved)
  const blog = new Blog(datarecieved)
  try {
    const result = await blog.save()
    user.blogs.push(result._id)
    await user.save()
    response.status(201).send(result)
  } catch (error) {
    next(error)
  }
})

blogsrouter.delete('/:id',async(request,response,next)=>{
  const id = request.params.id

  try {
    // const token = jwt.verify(request.token,process.env.SECRET)
    const user = request.user
    const blog = await Blog.findById(id)
    if(!blog){
      return response.status(404).send({
        "success":false,
        "error":{
          "code":"BLOG_NOT_FOUND",
          "message":"blog not found"
        }
      })
    }
    if(blog.user.toString() == user.userid){
      const result = await blog.deleteOne()
      response.status(204).end()
    }
    else{
      response.status(401).send("You are not authorized for this action")
    }
  } catch (error) {
    next(error)
  }
})

blogsrouter.put('/:id',async(request,response)=>{
  const id = request.params.id
  const {newlikes} = request.body
  const result = await Blog.findByIdAndUpdate(id,{"$set":{likes:newlikes}},{new:true})
  response.send(result)
})


module.exports = blogsrouter