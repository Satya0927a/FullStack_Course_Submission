const dummy = (blogs) => {
  return 1
}

const totallikes = (blogs)=>{
  return blogs.reduce((sum,curr)=>(
    sum + curr.likes
  ), 0)
}

const favblog = (blogs)=>{
  const likearr = blogs.map(blog=>blog.likes)
  const max = Math.max(...likearr)
  return blogs.filter(blog=> blog.likes === max)[0]
}

module.exports = {
  dummy,
  totallikes,
  favblog
}