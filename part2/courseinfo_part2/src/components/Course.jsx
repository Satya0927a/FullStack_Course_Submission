
const Course = (props)=>{
  const {course} = props
  const {name, parts} = course

  const noarr = parts.map((item)=>item.exercises)
  const total = noarr.reduce((sum,item)=>{
    return sum + item
  },0)
  return(
      <div>
        <h1>{name}</h1>
        <Content parts = {parts} />
        <Total total = {total}/>
      </div>
  )
}
const Content = (props)=>{
  const {parts} = props
  return(
    <div>
      {parts.map((part)=><Part name = {part.name} noofexe = {part.exercises} key={part.id}/>)}
    </div>
  )
}

const Part = (props)=>{
  const {name,noofexe} = props
  return(
    <div>
      <p>{name} {noofexe}</p>
    </div>
  )
}

const Total = (props)=>{
  const {total} = props
  return(
    <div>
        <p>Total no of exercises: {total}</p>
    </div>
  )
}

export default Course