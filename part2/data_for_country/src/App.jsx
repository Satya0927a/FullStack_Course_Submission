import { useState, useEffect } from 'react'
import axios from 'axios'
const baseurl = "https://studies.cs.helsinki.fi/restcountries/api/all"
const weatherapikey = import.meta.env.VITE_SOME_KEY

const App = ()=>{
  const [userinput, setuserinput] = useState("")
  const [countrynamedata, setcountrynamedata] = useState([])
  const [searched, setsearched] = useState([])
  useEffect(()=>{
    axios
      .get(baseurl)
      .then(response=>{
        setcountrynamedata(response.data.map(element=>(element.name.common)))
        console.log(countrynamedata);
        
      })
  },[])


  function handleuserinput(event){
    const value = event.target.value
    setuserinput(value)
    if(value.length>0){
      setsearched(countrynamedata.filter(country =>country.toLowerCase().startsWith(value.toLowerCase())))   
    }
    else{
      setsearched([])
    }
  }
  return(
    <div>
      <input value={userinput} onChange={handleuserinput} placeholder='enter the name of country'/>
      <div>
        search result:
        <Searchresult searched={searched} setsearched={setsearched}></Searchresult>
      </div>
    </div>
  )
}

const Searchresult = ({searched,setsearched})=>{
  const [finalresult,setfinalresult] = useState(null)
  const [weather,setweather] = useState(null)
  useEffect(()=>{

    if(searched.length == 1){
      axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${searched[0]}`)
      .then(response=>{
        const country = response.data
        setfinalresult(country)

        axios 
          .get(`https://api.openweathermap.org/data/2.5/weather?q=${country.capital}&appid=${weatherapikey}`)
          .then(response=>{
            // console.log(response.data);
            
            const weather = response.data
            setweather(weather)
          })
      }
    );

    }
    else{
      setfinalresult(null)
    }
  
  },[searched])
  
  
  if(searched.length == 1 && finalresult && weather){
    return(
      <>
        <h1>{finalresult.name.common}</h1>
        <p>capital:{finalresult.capital} <br />
        area:{finalresult.area}</p>
        <h2>Languages</h2>
        <ul>
          {Object.values(finalresult.languages).map((ele,index)=>(<li key={index}>{ele}</li>))}
        </ul>
        <img src={finalresult.flags.svg} alt="" height={100} />
        <div>
          <h2>Weather in {finalresult.capital}</h2>
          <p>temp:{weather.main.temp}</p>
          <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt=""/>
         
        </div>
      </>
    )
  }
  else if(searched.length < 10){
    return(
      <>
        {searched.map((elem, index) =>(<Countrylist key={index} elem={elem} setsearched={setsearched}></Countrylist>))}
      </>
    )
  }
  else{
    return(
      <>too many matches specify the name</>
    )
  }
}

const Countrylist = ({elem,setsearched})=>{
  function showdetails(){
    setsearched([elem])
  }
  return(
    <>
      <pre>{elem}</pre>
      <button onClick={showdetails}>show</button>
    </>
  )
}

export default App
