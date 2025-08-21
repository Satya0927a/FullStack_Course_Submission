const blogsrouter = require('express').Router()
const Blog = require('../models/blog')
const { info } = require('../utils/logger')

blogsrouter.get('/', async(request, response) => {
  const blogs = await Blog.find({})
  response.send(blogs)
})

blogsrouter.post('/', async(request, response, next) => {
  var datarecieved = request.body
  if(!datarecieved.likes){
    datarecieved = {
      ...datarecieved,
      likes:0
    }
  }
  const blog = new Blog(datarecieved)
  try {
    const result = await blog.save()
    response.status(201).send(result)
  } catch (error) {
    next(error)
  }
})



module.exports = blogsrouter