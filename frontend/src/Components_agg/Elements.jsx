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
      const startTime = performance.now();

      axios
        .post("http://localhost:4000/query", props.data, {
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          const endTime = performance.now();
          const duration = endTime - startTime;
          console.log(duration);
          let dat = response.data["result"];
          const jsonString = JSON.stringify(dat);
          console.log(jsonString);
          let temp = props.messages;
          let textToAdd = ">The Output for your query :" + jsonString;
          console.log(textToAdd);
          temp.push(textToAdd);
          props.setMessages(temp);
          alert("Successful Query. Output Ready!");
        })
        .catch((error) => {
          console.error(error);
          //     let temp = props.messages;
          // let textToAdd = ">Query Sent to Server" + response.data.data.join(" ");
          // temp.push(textToAdd);
        });
      props.handler(false);
    }
    if (option == "Option 4") {
      console.log("terminal refreshed");
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
        <button
          className="button-gap"
          onClick={() => handleOptionClick("Option 4")}
        >
          Show Output in Terminal
        </button>
      </ul>
      {selectedOption && <p>You selected: {selectedOption}</p>}
    </div>
  );
}
export default Elements;
