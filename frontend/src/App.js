import "./App.css";
import SchemaBuilder from "./Components/SchemaBuilder";
import Upload from "./Components/Upload";
import Elements from "./Components/Elements";
import { useState } from "react";

function App() {
  const [toShow, setToShow] = useState(false);
  const [data, setData] = useState([{ columnName: "", dataType: "", pk: 0, nc: 0, uc: 0, fk: 0,replace:0, replaceWith: "none", replaceActive:0, tempColName:""}]);
  const [c_names, setCNames] = useState(['HI'])

  const [tables, modTable] = useState([])

  const [messages, setMessages] = useState(['>Welcome to flow db'])

  return (
    <div className="container">
      <div className="top-section">
        <div className="left">{toShow && <SchemaBuilder data={data} setData={setData} c_names = {c_names} setCNames = {setCNames}/>}</div>
        <div className="right">
          <ul>
            <li>
              <Upload c_names = {c_names} setCNames = {setCNames} messages = {messages}/>
            </li>
            <li>
              <Elements handler={setToShow} data = {data} setData = {setData} setMessages = {setMessages} messages = {messages} tables = {tables} modTable = {modTable}></Elements>
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
