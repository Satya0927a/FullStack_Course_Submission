import { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]


  const [selected, setSelected] = useState(0)
  const [vote, setvote] = useState([0,0,0,0,0,0,0,0])
  const random = ()=> Math.floor(Math.random()*(anecdotes.length))
  
  const next = ()=>{
    setSelected(random)
  }
  const votethis = ()=>{
    const copy = [...vote]
    copy[selected] += 1;
    setvote(copy)
  }
  
  const indexofgreater = vote.indexOf(Math.max(...vote))

  return (
    <div>
      <h3>
      {anecdotes[selected]}
      </h3>
      <p>Votes: {vote[selected]}</p>
      <Btn func={next} text="next anecdote"/>
      <Btn func={votethis} text="vote"/>
      <h1>Highest voted anecdote</h1>
      <h3>{anecdotes[indexofgreater]}</h3>
    </div>
  )
}

const Btn = (props)=>{
  const {func,text} = props
  return(
    <>
      <button onClick={func}>{text}</button>
    </>
  )
}

export default App