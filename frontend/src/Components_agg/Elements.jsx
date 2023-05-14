import React, { useState } from "react";
import "./Elements.css";
import axios from "axios";
function Elements(props) {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    props.handler(1);
    props.data.type = 1;
    props.setData([
      {
        type: 1,
        tableName: "",
        columnName: "",
        limit: 0,
        condition: "",
      },
    ]);

    if (option == "Option 2") {
      props.handler(2);
      props.data.type = 2;
      props.setData([
        {
          type: 2,
          tableName: "",
          columnName: "",
          condition: "",
        },
      ]);
    }

    if (option == "Option 3") {
      console.log(props.data);
      axios
        .post("http://localhost:4000/query", props.data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.error(error);
        });
      props.handler(false);
    }
  };

  return (
    <div>
      <ul>
        <button
          className="button-gap"
          onClick={() => handleOptionClick("Option 1")}
        >
          + Add Select Query
        </button>

        <button
          className="button-gap"
          onClick={() => handleOptionClick("Option 2")}
        >
          + Add Aggregation Query
        </button>
        <button
          className="button-gap"
          onClick={() => handleOptionClick("Option 3")}
        >
          Submit Query
        </button>
      </ul>
      {selectedOption && <p>You selected: {selectedOption}</p>}
    </div>
  );
}
export default Elements;
