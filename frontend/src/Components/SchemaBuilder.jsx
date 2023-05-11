import "./SchemaBuilder.css";
import { useState } from "react";


const dtypes = ['String', 'Integer', 'Boolean', 'TimeStamp', 'Object', 'Date']
function SchemaBuilder({ data, setData, c_names, setCNames }) {


  

  const handleColumnNameChange = (e, index) => {
    const newData = [...data];
   
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

  const handleChechbox = (e, index) => {
    const newData = [...data];
    newData[index][e.target.id] = Number(e.target.checked)
    setData(newData);
  }

  return (
    <div>
      <ul>
        {data.map((row, index) => (
          <li key={index}>
            <div>
            <label htmlFor={`columnName-${index}`}>column name</label>
            <input type="text" />
            </div>
            <div>
              <label htmlFor={`referred from-${index}`}>referred from</label>
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
              <label htmlFor={`dataType-${index}`}>data type</label>
              <select
                id={`dataType-${index}`}
                value={row.dataType}
                onChange={(e) => handleDataTypeChange(e, index)}
              >
                <option value="">Select Data Type</option>
                {dtypes.map((val) => {
                  return <option value={val}>{val}</option>
                })}
                
            
                
              </select>
            </div>
            <div class="checkbox-list">
  <label>
    <input type="checkbox" id = "pk" 
                onChange={(e) => handleChechbox(e, index)}/>
    Primary Key
  </label>
  <label>
    <input type="checkbox" id = "nc" 
                onChange={(e) => handleChechbox(e, index)} />
    Null Check
  </label>
  <label>
    <input type="checkbox" id = "uc" 
                onChange={(e) => handleChechbox(e, index)}/>
    Unique
  </label>
  <label>
    <input type="checkbox" id = "fk" 
                onChange={(e) => handleChechbox(e, index)}/>
    foreign key
  </label>
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
