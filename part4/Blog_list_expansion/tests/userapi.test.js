const {test,before,beforeEach,after,describe} = require('node:test')
const mongoose = require('mongoose')
const assert = require('assert')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const { info } = require('../utils/logger')
const api = supertest(app)

beforeEach(async()=>{
  await User.deleteMany({})
})

describe("Invalid users are not created and that an invalid add user operations returns suitable code and message",()=>{
  test("request with no username is not created",async()=>{
    const testuser = {
      name:"test",
      username:"",
      password:"testpassword"
    }
    const result = await api.post('/api/user/create').send(testuser).expect(400)
    assert(result.error.text === "User validation failed: username: username is required")
  })
  test("request with no password is not created",async()=>{
    const testuser = {
      name:"test",
      username:"testusername",
      password:""
    }
    const result = await api.post('/api/user/create').send(testuser).expect(400)
    assert(result.body.error.message === "password must be given.")
  })
  test("request with username less that 3 charecter is not created",async()=>{
    const testuser = {
      name:"test",
      username:"s",
      password:"testpassword"
    }
    const result = await api.post('/api/user/create').send(testuser).expect(400)
    assert(result.error.text === "User validation failed: username: the username must be 3 charecters or more")
  })
  test("request with password less than 3 charecter is not created",async()=>{
    const testuser = {
      name:"test",
      username:"testusername",
      password:"ab"
    }
    const result = await api.post('/api/user/create').send(testuser).expect(400)
    assert(result.body.error.message === "the password must be more than 3 charecters long.")
  })
  
})

after(async()=>{
  mongoose.connection.close()
})