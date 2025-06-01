const Header = (props) => {
  // console.log(props)
  return (
    <div>
      <h1>{props.content}</h1>
    </div>
  );
};

const Content = (props) => {
  console.log(props);
  return (
    <div>
      <Part
        exe_name={props.content_arr[0].name}
        exe_no={props.content_arr[0].exercises}
      />
      <Part
        exe_name={props.content_arr[1].name}
        exe_no={props.content_arr[1].exercises}
      />
      <Part
        exe_name={props.content_arr[2].name}
        exe_no={props.content_arr[2].exercises}
      />
    </div>
  );
};

const Part = (props) => {
  return (
    <div>
      <p>
        {props.exe_name} {props.exe_no}
      </p>
    </div>
  );
};

const Total = (props) => {
  console.log(props);
  return (
    <div>
      <p>
        Number of exercise{" "}
        {props.content_arr[0].exercises +
          props.content_arr[1].exercises +
          props.content_arr[2].exercises}
      </p>
    </div>
  );
};

const App = () => {
  const course = {
    name: "Half Stack application development",
    parts: [
      {
        name: "Fundamentals of React",
        exercises: 10,
      },
      {
        name: "Using props to pass data",
        exercises: 7,
      },
      {
        name: "State of a component",
        exercises: 14,
      },
    ],
  };

  return (
    <div>
      <Header content={course.name} />
      <Content content_arr={course.parts} />
      <Total content_arr={course.parts} />
    </div>
  );
};

export default App;
