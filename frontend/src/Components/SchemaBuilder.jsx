import React from "react";
import { useState } from "react";
import RowBuilder from "./RowBuilder";
const SchemaBuilder = ({ data, setData, c_names, setCNames }) => {
  const handleAddRow = () => {
    setData([
      ...data,
      {
        columnName: "",
        dataType: "",
        pk: 0,
        nc: 0,
        uc: 0,
        fk: 0,
        replace: 0,
        replaceWith: "none",
        replaceActive: 0,
        tempColName: "",
      },
    ]);
  };
  return (
    <div>
      <ul>
        <RowBuilder
          data={data}
          setData={setData}
          c_names={c_names}
          setCNames={setCNames}
        />
      </ul>
      <button onClick={handleAddRow}>+ Add Row</button>
    </div>
  );
};

export default SchemaBuilder;
