import "./App.css";
import SchemaBuilder from "./Components_agg/SchemaBuilder";
import Elements from "./Components_agg/Elements";
import { useState } from "react";
import { useLocation } from 'react-router-dom'

function App() {
  const location = useLocation();
  const responseFromServer = location.state.resp;
  const [toShow, setToShow] = useState(0);
  const [c_names,setCNames] = useState(["Hi"]);
  const [data, setData] = useState([{
    type : 1,
    tableName: "",
    columnName: "",
    limit: 0,
    condition: ""
  }]);
  
  const tables = []
  for(let i = 0 ; i<responseFromServer.length; i++) {
    let tableName = Object.keys(responseFromServer[i]);
    tables.push(tableName);
  }
  const [messages, setMessages] = useState(['>Welcome to flow db'])

  return (
    <div className="container">
      <div className="top-section">
        <div className="left">{toShow && <SchemaBuilder ts = {toShow} data={data} setData={setData} c_names = {c_names} setCNames = {setCNames} tables = {tables} responseFromServer = {responseFromServer}/>}</div>
        <div className="right">
          <ul>
            
            <li>
              <Elements handler={setToShow} data = {data} setData = {setData} setMessages = {setMessages} messages = {messages} ></Elements>
            </li>
          </ul>
        </div>
      </div>
      <div className="bottom-section">
      {messages.map((message) => (
          <p className="message">{message}</p>
        ))}
        </div>
    </div>
  );
}

export default App;
