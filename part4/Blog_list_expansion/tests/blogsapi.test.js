const supertest = require('supertest')
const {test,after,before, describe, beforeEach} = require('node:test')
const assert = require('node:assert')
const app = require('../app')
const { default: mongoose } = require('mongoose')
const Blog = require('../models/blog')
const { info } = require('../utils/logger')
const { log } = require('node:console')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const api = supertest(app)

const initialdata = [
  {
    title:"this is the title of the update database",
    author:"john dickson",
    url:"www.whatthefuckisthis.com",
    likes:345
  }
]

beforeEach(async()=>{
  await  Blog.deleteMany({})
  await User.deleteMany({})
  info("deleted all blog and user from the previous data")
  await Blog.insertMany(initialdata)
  await User.insertOne({
    name:"admin",
    username:"admin123",
    passwordHash: await bcrypt.hash('password',10)
  })
})

test("checking if the response is in json format and returns correct no of data",async()=>{
  const blogsatstart = await Blog.find({})
  const response = await api.get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
  info(blogsatstart.map(blog=>blog.toJSON()))
  assert.strictEqual(response.body.length,blogsatstart.length,"Number of blogs returned does not match database count")
})

test("verifing the unique indentifer of blog posts is named id not _id", async()=>{
  const response = await api.get('/api/blogs')
  const blog = response.body[0]
  assert(blog.id)
  assert(blog._id == undefined)

})

describe("Api is successfully able to send data to the database and in correct format",async()=>{

  test("Api is successfully able to send data to the database and also in correct format",async()=>{
    const result = await api.post('/api/user/login').send({
      username:'admin123',
      password:'password'
    })
    const token = result.body.token
    const blogatstart = await Blog.find({})
    const datatosend = {
      title:"this is a test data",
      author:"test god",
      url:"www.protesting.com",
      likes:323
    }
    const response = await api.post('/api/blogs').send(datatosend).set('Authorization',`Bearer ${token}`)
    const blogatend = await Blog.find({})
    assert.strictEqual(blogatend.length,blogatstart.length+1)
    assert(response.body.title)
    assert(response.body.author)
    assert(response.body.url)
    assert(response.body.likes)
  })
})
test.only("adding a blog without a token fails with proper status code and 401", async()=>{
  const testblog = {
    title:"this is a test data",
      author:"test god",
      url:"www.protesting.com",
      likes:323
  }
  const result = await api.post("/api/blogs").send(testblog).expect(401)
})


test("if the like property is not send it will default to zero in the database before storing ",async()=>{
  const data = {
    title:"how to communicate efficiently",
    author:"dail carnegi",
    url:"www.talkbetter.com",
  }

  const response = await api.post('/api/blogs').send(data)
  assert(response.body.likes !== undefined)
  assert.strictEqual(response.body.likes,0)
})

test('if the title and author property is missing server responds with error 500', async()=>{
  const data = {
    url:"www.hehelol.com",
    likes:234
  }
  const response = await api.post('/api/blogs').send(data)
  assert.strictEqual(response.statusCode,500)
})

test("testing for deleting blogs",async()=>{
  const dataatfirst = await Blog.find({})
  //id of the note to delete
  const id = dataatfirst[0]._id
  
  const response = await api.delete(`/api/blogs/${id}`)
  const dataatlast = await Blog.find({})

  assert(!dataatlast.some(item=>item._id.toString() === id.toString()))
})

test("testing for updating a blog post's no of likes",async()=>{
  const dataatfirst = await Blog.find({})
  const id = dataatfirst[0]._id

  const update = {newlikes:999}
  const result = await api.put(`/api/blogs/${id}`).send(update)
  const  dataatlast = await Blog.find({})
  assert(dataatlast[0].likes === update.newlikes)
})

after(async()=>{
  await mongoose.connection.close()
}
)