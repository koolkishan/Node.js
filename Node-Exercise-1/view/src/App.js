import { useEffect, useMemo, useState } from "react";
import "./styles.scss";
import TableBody from "./components/TableBody";
import TableHeader from "./components/TableHeader";
import ReactNotification from 'react-notifications-component'
import 'react-notifications-component/dist/theme.css'
import { store } from 'react-notifications-component';



function App() {
  //State for main Data
  const [data, setData] = useState([]);
  useEffect(()=>{
    const fetchData = async () => {
      try {
        const allData = await fetch("http://localhost:3000/allUsers")
        const d = await allData.json();
        setData(d.data)
      } catch (err) {
        console.log(err.message);
      }
      getNotifiaction("Success","Data loaded from Server","default")
    }
    fetchData();
  },[])

  //State for Inputs
  const [inputData, setInputData] = useState({
    firstInput: "",
    secondInput: "",
  });
  //State for update/add button
  const [currentOperation, setCurrentOperation] = useState({
    operation: "add",
  });

const getNotifiaction = (title,message,type) => {
  console.log('here')
  store.addNotification({
    title,
    message,
    type,
    insert: "top",
    container: "top-right",
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    dismiss: {
      duration: 5000,
      onScreen: true
    }
  }); }

  const dataRenderer = async () => {
    const staticData = [{
      "firstName": "Kishan",
      "secondName": "Sheth",
    },
    {
      "firstName": "Romit",
      "secondName": "Gandhi",
    },
    {
      "firstName": "Yash",
      "secondName": "Mehta",
    },
    {
      "firstName": "Herin",
      "secondName": "Zaveri",
    },
    {
      "firstName": "Chaitanya",
      "secondName": "Rana",
    },
    {
      "firstName": "Savan",
      "secondName": "Aghera",
    },
    {
      "firstName": "Smit",
      "secondName": "Hapani",
    },
    {
      "firstName": "Smit",
      "secondName": "Panchal",
    },
    {
      "firstName": "Rupesh",
      "secondName": "Suryavanshi",
    },
    {
      "firstName": "Ravindra",
      "secondName": "Singh",
    },
  ];
  //call the API and send the data
  try {
    const sendData = {
      method:'POST',
      headers: {'Content-Type': 'application/json' },
      body: JSON.stringify(staticData)
    }
    const newUsers = await fetch('http://localhost:3000/createMultipleUsers',sendData);
    let {data:dt} = await newUsers.json();
     dt = dt.map(function(item) {
      delete item.__v;
      return item;
    })
    setData([...data,...dt])
    getNotifiaction("Success","Multiple Data Inserted into the Server","success")
  }
  catch(err) {
    console.log(err);
  }
  //add the data recieved from the api to the current state. Add data not overwrite it
  }

  //Input onChange method
  const handleChange = (event) => {
    setInputData({ ...inputData, [event.target.name]: event.target.value });
  };

  //Method for adding data
  const handleDataAdd = async (event) => {
    event.preventDefault();
    const firstName = inputData.firstInput;
    const secondName = inputData.secondInput;
    try {
      //Add data only if both inputs have values
      if (firstName && secondName) {
        const sendData = {
          method:'POST',
          headers: {'Content-Type': 'application/json' },
          body: JSON.stringify({firstName,secondName})
        }
        const newUser = await fetch('http://localhost:3000/createUser',sendData);
        const {data:dt} = await newUser.json();
        console.log(dt);
        setData([...data, { _id:dt._id, firstName:dt.firstName, secondName:dt.secondName }]);
        setInputData({ firstInput: "", secondInput: "" });
        getNotifiaction("Success","Data has been added to the server","success")
      }
    } catch (err) {
      console.log(err);
    }
  };

  //Method for deleteing data
  const handleDelete =async (id) => {
    //if the data which is to be delete is in update mode then clear the data update inputs and then delete data
    if (id === currentOperation.id) {
      setCurrentOperation({ operation: "add" });
      setInputData({ firstInput: "", secondInput: "" });
    }
    const sendData = {
      method:'DELETE',
      headers: {'Content-Type': 'application/json' },
    }
    try {
      const result = await fetch(`http://localhost:3000/deleteUser/${id}`,sendData)
      const newData= data.splice(0).filter((dt) => dt._id !== id);
      const newArray = [...newData];
      setData([...newArray]);
      getNotifiaction("Deleted","Data deleted from Server","danger")
      } catch (err) {
        console.log(err);
      }
  };

  //Method for changing into update mode
  const handleUpdate = (id) => {
    const oldData = data.filter((dt) => dt._id === id);
    setInputData({
      firstInput: oldData[0].firstName,
      secondInput: oldData[0].secondName,
    });
    setCurrentOperation({ _id:id, operation: "update" });
    getNotifiaction("Success","Current Operation set to update","warning")
  };

  //Method for updating the data
  const setUpdatedData = async () => {
    const input1 = inputData.firstInput;
    const input2 = inputData.secondInput;
    //Only update if the input have values
    const sendData = {
      method:'PATCH',
      headers: {'Content-Type': 'application/json' },
    }
    if (input1 && input2) {
      const newDt = await fetch(`http://localhost:3000/updateuser/${currentOperation._id}?firstName=${input1}&secondName=${input2}`,sendData);
      const newD = await newDt.json();
      const index = data.findIndex((el) => el._id === currentOperation._id);
      let newData = [...data];
      newData[index].firstName = newD.data.firstName;
      newData[index].secondName = newD.data.secondName;
      setData([...newData]);
      setCurrentOperation({ operation: "add" });
      setInputData({ firstInput: "", secondInput: "" });
      getNotifiaction("Success","Data updated into the Server","success")
    }
  };


  const renderData = useMemo(()=> {
    return <TableBody data={data} Delete={handleDelete} update={handleUpdate} />
  },[data,handleDelete,handleUpdate])

  return (
    <>
    <ReactNotification />
    <div className="app">

      <form>
        <table>
          <TableHeader
            inputData={inputData}
            handleChange={handleChange}
            currentOperation={currentOperation}
            handleDataAdd={handleDataAdd}
            setUpdatedData={setUpdatedData}
            dataRenderer={dataRenderer}
          />
          {/*TableBody has a Data component for all the data rows*/}
          {data.length>0 && renderData}
        </table>
      </form>
    </div>
    </>
  );
}

export default App;
