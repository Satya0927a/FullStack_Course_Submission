const supertest = require('supertest')
const {test,after,before, describe} = require('node:test')
const assert = require('node:assert')
const app = require('../app')
const { default: mongoose } = require('mongoose')
const Blog = require('../models/blog')
const { info } = require('../utils/logger')
const { log } = require('node:console')

const api = supertest(app)

const initialdata = [
  {
    title:"this is the title of the update database",
    author:"john dickson",
    url:"www.whatthefuckisthis.com",
    likes:345
  }
]

before(async()=>{
  await  Blog.deleteMany({})
  info("deleted the previous data")
  await Blog.insertMany(initialdata)
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

  test("Api is successfully able to send data to the database",async()=>{
    const blogatstart = await Blog.find({})
    const datatosend = {
      title:"this is a test data",
      author:"test god",
      url:"www.protesting.com",
      likes:323
    }
    const response = await api.post('/api/blogs').send(datatosend)
    const blogatend = await Blog.find({})
    assert.strictEqual(blogatend.length,blogatstart.length+1)
  })

  test("the data stored is stored correctly in the database",async()=>{
    const dataarr = await Blog.find({})
    const newdata = dataarr[1]
    assert(newdata.title)
    assert(newdata.author)
    assert(newdata.url)
    assert(newdata.likes)
  })
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

after(async()=>{
  await mongoose.connection.close()
}
)