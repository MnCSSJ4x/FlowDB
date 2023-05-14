import React from "react";
import { useState } from "react";
import RowBuilder from "./RowBuilder";
import RowBuilder_agg from "./RowBuilder_agg";
const SchemaBuilder = ({
  ts,
  data,
  setData,
  c_names,
  setCNames,
  tables,
  responseFromServer,
}) => {
  const handleAddRow = () => {
    if (data.type == 1) {
      setData([
        ...data,
        {
          type: 1,
          tableName: "",
          columnName: "",
          limit: 0,
          condition: "",
          rhs:""
        },
      ]);
    } else {
      setData([
        ...data,
        {
          type: 2,
          tableName: "",
          columnName: "",
          condition: "",
        },
      ]);
    }
  };
  return (
    <div>
      <ul>
        {ts == 1 && (
          <RowBuilder
            data={data}
            setData={setData}
            c_names={c_names}
            setCNames={setCNames}
            tables={tables}
            responseFromServer={responseFromServer}
          />
        )}
        {ts == 2 && (
          <RowBuilder_agg
            data={data}
            setData={setData}
            c_names={c_names}
            setCNames={setCNames}
            tables={tables}
            responseFromServer={responseFromServer}
          />
        )}
      </ul>
      <button onClick={handleAddRow}>+ Add Row</button>
    </div>
  );
};

export default SchemaBuilder;
