import logo from './logo.svg';
import './App.css';
import { useState } from 'react';

function AddItem() {
  const [data, setData] = useState([{ columnName: "", dataType: "" }]);

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
                <option value="firstName">First Name</option>
                <option value="lastName">Last Name</option>
                <option value="email">Email</option>
                <option value="phoneNumber">Phone Number</option>
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
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="date">Date</option>
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




export default AddItem;
