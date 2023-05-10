import React, { useState } from "react";
import "./Elements.css";
import axios from "axios";
function Elements(props) {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    props.handler(true);

    if (option == "Option 2") {
      axios
        .post("http://localhost:4000/schema", props.data, {
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
    }
  };

  return (
    <div>
      <ul>
        <button
          className="button-gap"
          onClick={() => handleOptionClick("Option 1")}
        >
          Add Schema
        </button>

        <button
          className="button-gap"
          onClick={() => handleOptionClick("Option 2")}
        >
          Finalize Schema
        </button>
        <button
          className="button-gap"
          onClick={() => handleOptionClick("Option 3")}
        >
          Option 3
        </button>
      </ul>
      {selectedOption && <p>You selected: {selectedOption}</p>}
    </div>
  );
}
export default Elements;
