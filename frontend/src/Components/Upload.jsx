import React from "react";
import { useState } from "react";
import "./Upload.css";
import axios from "axios";
function Upload() {
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    // Get the files from the input element
    const fileList = event.target.files;

    // Convert the FileList object to an array
    const filesArray = Array.from(fileList);

    // Add the new files to the existing files state
    setFiles([...files, ...filesArray]);
  };

  const handleRemoveFile = (indexToRemove) => {
    // Filter out the file at the specified index
    const filteredFiles = files.filter(
      (file, index) => index !== indexToRemove
    );

    // Update the files state with the filtered files
    setFiles(filteredFiles);
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("author", "Monjoy");
    formData.append("files", files[0]);
    axios
      .post("http://localhost:4000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className>
      <input
        type="file"
        multiple
        onChange={handleFileChange}
        className="input-type"
      />
      <ul className="file-list">
        {files.map((file, index) => (
          <li key={index} className="file-list-element">
            {file.name} - {file.size} bytes
            <button onClick={() => handleRemoveFile(index)}>Remove</button>
          </li>
        ))}
        <button onClick={handleSubmit}>Submit</button>
      </ul>
    </div>
  );
}

export default Upload;
