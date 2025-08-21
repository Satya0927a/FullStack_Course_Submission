const {test,describe} = require('node:test')
const assert = require('node:assert')
const { totallikes, favblog } = require('../utils/list_helper')

describe("total likes",()=>{

  const blogs = [
    {
      content:"this is a blog 1",
      author:"john wick",
      likes:123
    },
    {
      content:"this is a blog 2",
      author:"rick smash",
      likes:100
    },
    {
      content:"this is a blog 3",
      author:"rohan",
      likes:50
    }
  ]
   const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
      likes: 5,
      __v: 0
    }
  ]
  test("for empty list is zero",()=>{
    const result = totallikes([])
    assert.strictEqual(result,0)
  })
  test("for a list only one blog",()=>{
    const result = totallikes(listWithOneBlog)
    assert.strictEqual(result,5)
  })
  test("for bigger list of blogs",()=>{
    const result = totallikes(blogs)
    assert.strictEqual(result, 273)
  })
  test("for favorite blog with highest likes",()=>{
    const result = favblog(blogs)
    assert.deepStrictEqual(result,blogs[0])
  })
})