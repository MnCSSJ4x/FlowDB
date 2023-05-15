# FlowDB
"FlowDB" is a full-stack application that bridges the gap between SQL and NoSQL. We provide a data ingestion pipeline along with a simple query
tool via an interactive UI. The application also allows a user to do data cleaning with various options available and define their own schema for the data provided in the form of a CSV.
We believe using this application users can leverage the technical advantages which NoSQL brings but couldn’t do so due to their lack of underlying concepts
### Instructions to setup and reproducing results: 
- Clone this repository 
- Once you clone this you get 2 folders: frontend and backend
- Make sure you have node package manager npm avaiable. Install it from https://www.npmjs.com/package/npm
- Steps to do inside frontend folder:
   - Run the command `npm install`. This will install all necessary packages needed 
- Steps to do inside backend folder: 
  - Run the command `npm install`. This will install all necessary packages 
- Make sure you have mongodb installed and its services running. 
    - If you have mongodb installed, then mongod command should be working. If not please install mongodb and not mongodb atlas (which is cloud storage based). The installation can be done with the help of the link https://www.mongodb.com/docs/manual/installation/
    - Once mongodb is installed, in any directory where mongodb has the necessary permissions, run the command `mongod -dbpath pathname`. For example: `mongod -dbpath '/Users/monjoy/Desktop/db'`
    - If there is no issue with mongodb service, you will see it is waiting for requests. This means your mongodb services are working 
- Once mongod is running. Go to the backend folder and start the server using command `node back.js` 
- After the server starts go to the frontend folder and start the client using command `npm run start` 

Doing these steps will start the application and then the user can test out with the help of data folder inside backend with the csv present there or use their own csv files! 
<br/>
Please go through the report.pdf to get more idea about our application as well as see the performance benchmarks.<br/> 
A full presentation and demo video can be found here: https://www.youtube.com/watch?v=dyE1VIBVGcU
