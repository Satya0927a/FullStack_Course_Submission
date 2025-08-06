import { useState, useEffect } from 'react'
import numberslog from './service/numbers'

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [filterinput, setfilterinput] = useState('')
  const [notification, setnotification] = useState({message:null,color:null})

  useEffect(()=>{

    numberslog
      .getAll()
      .then(initialdata =>{
        setPersons(initialdata)
      })
  },[])

  // console.log("App is rendered");

  return (
    <div>
      <h1>Phonebook</h1>
      <Notification notification={notification}></Notification>
      <Filter filterinput = {filterinput} setfilterinput = {setfilterinput}></Filter>
      <h2>add new</h2>
      <Personform persons = {persons} setPersons = {setPersons} setnotification={setnotification}></Personform>
      <h2>Numbers</h2>
      <Persons persons = {persons} setPersons={setPersons} filterinput = {filterinput}></Persons>
    </div>
  )
}

const Filter = ({filterinput, setfilterinput})=>{
  // console.log("filter is rendered");
  
   function handlefilterinput(event){
    setfilterinput(event.target.value)
  }
  return(
    <div>
        filter shown with: <input value={filterinput} onChange={handlefilterinput} placeholder='enter name to search...'/>
    </div>
  )
}

const Persons = ({persons, setPersons, filterinput})=>{
  // console.log("person is rendered");
  
  return(
    <>
      {persons.filter(person=>(person.name.toLowerCase().startsWith(filterinput))).map((person)=><Personelement key={person.id} person = {person} persons={persons} setPersons={setPersons}></Personelement>)}
    </>
  )
}

const Personelement = ({person,persons,setPersons})=>{
  const {name,number,id} = person
  function handlepersondelete(id){
    const userwant = window.confirm(`do you want to delete ${name} from the list`);
    if(userwant == true){
      numberslog
        .deleteData(id)
        .then(response=>{
          setPersons(persons.filter(item=>(item.id !== id)));
        })
    }
    
  }
  return(
    <>
      <p>{name} {number}</p>
      <button onClick={()=>handlepersondelete(id)}>delete</button>
    </>
  )
}

const Personform = ({persons,setPersons, setnotification})=>{
  // console.log("person form is rendered");
  
  const [newName, setNewName] = useState('')
  const [newnumber, setnumber] = useState('')

  const addname = (event)=>{
    event.preventDefault()
    const nameexist = persons.some(person=>(person.name === newName.trim()))
    
    if(nameexist){
      const target = persons.filter(person=>(person.name == newName.trim()))
      console.log(target);
      
      const userwantupdate = window.confirm(`${newName} is already added to phonebook do you want to update the number?`)
      if(userwantupdate == true){
        const newdata = {
          ...target[0],
          number:newnumber
        }
        numberslog
          .updateData(target[0].id,newdata)
          .then(response=>{
            setPersons(persons.map(person => 
              person.id === target[0].id ? { ...person, number: newnumber } : person
            ))
            setnotification({message:`${newName}'s Number updated successfully`, color:"orange"})
            setNewName("")
            setnumber("")

            setTimeout(() => {
              setnotification({message:null, color:null})
            }, 3000);
          })
          .catch(error=>{
            if(error.status == 404){
              setnotification({message:`Information of ${newName} has already been removed from the server`, color:"red"})
              setTimeout(() => {
                setnotification({message:null, color:null})
              }, 5000);
            } 
          })
      }
    }
    else{
      const newobj = {
          name: newName.trim(),
          number: newnumber,
          id: `${persons.length + 1}`
        }

        numberslog
          .addData(newobj)
          .then(response =>{
            setPersons(persons.concat(newobj))
            setnotification({message:`Added ${newName} successfully`, color:"green"})

            setNewName("")
            setnumber("")

            setTimeout(() => {
              setnotification({message:null, color:null})
            }, 2000);
          })
      
        
    }

  }
  
  const inputname = (event)=>{
    setNewName(event.target.value)
    // console.log(event.target.value)
  }

  function handlenumberinput(event){
    setnumber(event.target.value)
    // console.log(newnumber);
    
  }
  return(
    <>
      <form onSubmit={addname}>
        <div>
          name: <input value={newName} onChange={inputname} placeholder='Enter name...'/>
        </div>
        <div>
          number: <input value={newnumber}  onChange={handlenumberinput} placeholder='enter number...'/>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  )
}

const Notification = ({notification})=>{
  const {message, color} = notification
  const notstyle = {
    color: `${color}`,
    padding: "0.5rem",
    border: "2px solid",
    marginBottom: "1rem"
  }

  if(message == null){
    return null
  }
  else{
    return(
      <div style={notstyle}>
          {message}
      </div>
    )
  }
}

export default App