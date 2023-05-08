import React, { useState } from "react";
import "./Elements.css";
function Elements(props) {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
    props.handler(true);
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
          Option 2
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
