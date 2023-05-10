import "./App.css";
import SchemaBuilder from "./Components/SchemaBuilder";
import Upload from "./Components/Upload";
import Elements from "./Components/Elements";
import { useState } from "react";

function App() {
  const [toShow, setToShow] = useState(false);
  const [data, setData] = useState([{ columnName: "", dataType: "" }]);
  const [c_names, setCNames] = useState(['HI'])

  return (
    <div className="container">
      <div className="top-section">
        <div className="left">{toShow && <SchemaBuilder data={data} setData={setData} c_names = {c_names} setCNames = {setCNames}/>}</div>
        <div className="right">
          <ul>
            <li>
              <Upload />
            </li>
            <li>
              <Elements handler={setToShow} data = {data}></Elements>
            </li>
          </ul>
        </div>
      </div>
      <div className="bottom-section"></div>
    </div>
  );
}

export default App;
