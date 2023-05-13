import "./RowBuilder.css";
import { useState } from "react";

const dtypes = ["String", "Integer", "Boolean", "TimeStamp", "Object", "Date"];
function RowBuilder({ data, setData, c_names, setCNames }) {
  const handleColumnNameChange = (e, index) => {
    const newData = [...data];
    newData[index].columnName = e.target.value;
    setData(newData);
  };
  const handleTextChange = (e, index) => {
    const newData = [...data];
    newData[index].tempColName = e.target.value;
    setData(newData);
  };
  const handleReplaceWith = (e, index) => {
    const newData = [...data];
    newData[index]["replaceActive"] =
      e.target.id === "ncreplace" && e.target.value === "on" ? 1 : 0;
    if (e.target.id === "ncdelete") {
      newData[index]["replaceWith"] = "delete";
    }
    setData(newData);
  };

  const handleReplaceWithValue = (e, index) => {
    const newData = [...data];
    newData[index]["replaceWith"] = e.target.value;
    setData(newData);
  };

  const handleDataTypeChange = (e, index) => {
    const newData = [...data];
    newData[index].dataType = e.target.value;
    setData(newData);
  };
  const handleDeleteRow = (index) => {
    const newData = [...data];
    newData.splice(index, 1);
    setData(newData);
  };
  const handleChechbox = (e, index) => {
    const newData = [...data];
    if (e.target.id === "nc") {
      newData[index]["replace"] = !newData[index]["replace"];
    }

    newData[index][e.target.id] = Number(e.target.checked);
    setData(newData);
  };

  return (
    <div>
      <ul>
        {data.map((row, index) => (
          <li key={index}>
            <div>
              <label htmlFor={`columnName-${index}`}>column name</label>
              <input type="text" onChange={(e) => handleTextChange(e, index)} />
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
                  return <option value={val.toString()}>{val}</option>;
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
                  return <option value={val}>{val}</option>;
                })}
              </select>
            </div>
            <div class="checkbox-list">
              <label>
                <input
                  type="checkbox"
                  id="pk"
                  onChange={(e) => handleChechbox(e, index)}
                />
                Primary Key
              </label>
              <label>
                <input
                  type="checkbox"
                  id="nc"
                  onChange={(e) => handleChechbox(e, index)}
                />
                Null Check
                {row["replace"] && (
                  <ul>
                    <li className="list-element">
                      <label>
                        Drop all nulls
                        <input
                          type="radio"
                          id="ncdelete"
                          name="nullhandler"
                          onChange={(e) => {
                            handleReplaceWith(e, index);
                          }}
                        ></input>
                      </label>
                    </li>
                    <li className="list-element">
                      <label>
                        Replace nulls with
                        <input
                          type="radio"
                          name="nullhandler"
                          id="ncreplace"
                          onChange={(e) => {
                            handleReplaceWith(e, index);
                          }}
                        ></input>
                        {row["replaceActive"] == 1 && (
                          <>
                            <label>
                              Enter value (enter mean for mean replacement)
                            </label>
                            <input
                              type="text"
                              id="ncreplacewith"
                              onChange={(e) => {
                                handleReplaceWithValue(e, index);
                              }}
                            ></input>
                          </>
                        )}
                      </label>
                    </li>
                    <li className="list-element">
                      <label>
                        Retain them as it is
                        <input
                          type="radio"
                          name="nullhandler"
                          id="nckeep"
                          onChange={(e) => {
                            handleReplaceWith(e, index);
                          }}
                        ></input>
                      </label>
                    </li>
                  </ul>
                )}
              </label>
              <label>
                <input
                  type="checkbox"
                  id="uc"
                  onChange={(e) => handleChechbox(e, index)}
                />
                Unique
              </label>
              <label>
                <input
                  type="checkbox"
                  id="fk"
                  onChange={(e) => handleChechbox(e, index)}
                />
                foreign key
              </label>
            </div>
            <button onClick={() => handleDeleteRow(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RowBuilder;
