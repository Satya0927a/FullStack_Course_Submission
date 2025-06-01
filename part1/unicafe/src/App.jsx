import { useState } from "react";

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);
  const [average, setaverage] = useState(0);

  const send_resgood = () => {
    setGood(good + 1);
    setaverage(average + 1);
  };
  const send_resneutral = () => {
    setNeutral(neutral + 1);
  };
  const send_resbad = () => {
    setBad(bad + 1);
    setaverage(average - 1);
  };

  const totalfeedback = good + bad + neutral;
  return (
    <div>
      <h1>give feedback</h1>
      <button onClick={send_resgood}>good</button>
      <button onClick={send_resneutral}>neutral</button>
      <button onClick={send_resbad}>bad</button>
      <Statistics
        good={good}
        neutral={neutral}
        bad={bad}
        average={average}
        total={totalfeedback}
      />
    </div>
  );
};

const Statistics = (props) => {
  const { good, neutral, bad, average, total } = props;
  if (total !== 0) {
    return (
      <div>
        <h1>statistics</h1>
        <table>
          <tbody>
        <StatisticsLine text = "good" value = {good} />
        <StatisticsLine text = "neutral" value = {neutral} />
        <StatisticsLine text = "bad" value = {bad} />
        <StatisticsLine text = "total no of feedback" value = {total} />
        <StatisticsLine text = "average" value = {(average/total)*100 + "%"} />
        <StatisticsLine text = "positive" value = {(good/total)*100 + "%"} />
          </tbody>
        </table>
      </div>
    );
  }
  else{
    return(
      <div>
        <p>No feeback given</p>
      </div>
    )
  }
};

const StatisticsLine = (props)=>{
  const {text, value} = props
  return(
    <>
    <tr>
      <td>{text}:</td>
      <td> {value}</td>
    </tr>
    </>
  )
}
export default App;
