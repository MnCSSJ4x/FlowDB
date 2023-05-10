import "./SchemaBuilder.css";
import { useState } from "react";



function SchemaBuilder() {
  const [data, setData] = useState([{ columnName: "", dataType: "" }]);

  const [c_names, setCNames] = useState(['HI'])

  const dtypes = ['String', 'Integer', 'Boolean', 'TimeStamp', 'Object', 'Date']

  const handleColumnNameChange = (e, index) => {
    const newData = [...data];
    console.log(e.target.value)
    newData[index].columnName = e.target.value;
    setData(newData);
  };

  const handleDataTypeChange = (e, index) => {
    const newData = [...data];
    newData[index].dataType = e.target.value;
    setData(newData);
  };

  const handleAddRow = () => {
    setData([...data, { columnName: "", dataType: "" }]);
  };

  const handleDeleteRow = (index) => {
    const newData = [...data];
    newData.splice(index, 1);
    setData(newData);
  };

  return (
    <div>
      <ul>
        {data.map((row, index) => (
          <li key={index}>
            <div>
              <label htmlFor={`columnName-${index}`}>Column Name</label>
              <select
                id={`columnName-${index}`}
                value={row.columnName}
                onChange={(e) => handleColumnNameChange(e, index)}
              >
                <option value="">Select Column Name</option>
                {c_names.map((val) => {
                  return <option value={val.toString()}>{val}</option>
                })}
              </select>
            </div>
            <div>
              <label htmlFor={`dataType-${index}`}>Data Type</label>
              <select
                id={`dataType-${index}`}
                value={row.dataType}
                onChange={(e) => handleDataTypeChange(e, index)}
              >
                <option value="">Select Data Type</option>
                {dtypes.map((val) => {
                  return <option value="val">{val}</option>
                })}
                
            
                
              </select>
            </div>
            <button onClick={() => handleDeleteRow(index)}>Delete</button>
          </li>
        ))}
      </ul>
      <button onClick={handleAddRow}>+ Add Row</button>
    </div>
  );
}

export default SchemaBuilder;
