const express = require('express')
const app = express()
const fileUpload = require("express-fileupload");
const cors = require('cors');
const { MongoClient } = require('mongodb');
const pkg = require('csvtojson');
const {csv} = pkg;


app.use(cors()); 
app.use(fileUpload()) // Enable CORS for all routes
app.post('/upload', (req, res)=>{
  const filename = req.files.files.name;
  const file = req.files.files;
  let uploadPath = __dirname+"/uploads/" + filename;
  console.log(file)
  file.mv(uploadPath, (err) => {
    if (err) {
      return res.json(err);
    }
    else{
      csv()
      .fromFile(uploadPath)
      .then((jsonObj) => {
        insertValues(getClient(), jsonObj).catch(console.dir).then(()=>{
          queryValues(getClient()).catch(console.dir).then((columnNames) => {
            res.json({'keys':columnNames})
          });
          // console.log(columnNames)
          // const columnsObj = { columns: columnNames.split(',').map(col => col.trim()) };
          // const jsonObj = JSON.parse(jsonString);
          // console.log(jsonObj); 
        });
      });
      // res.json(200)
    }
  });
})

app.post('/schema', (req, res)=>{
    console.log(res.body)
})


const port = 4000
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

function getClient() {
const uri = "mongodb://localhost:27017/";
return new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
}


async function queryValues(client){
  try{
      const database = client.db("testDB");
      const table = database.collection("temporary");
  
      // const query = { };
      // const options = {
      // projection: { name: 1, email: 1},
      // };
      const obj = await table.findOne();
      const keys = Object.keys(obj);
      console.log(keys)
      return keys
  } finally{
      await client.close();
  }
  }


async function insertValues(client, documents) {
  try {
      const database = client.db("testDB");
      const table = database.collection("temporary");
      // create a document to insert
      const result = await table.insertMany(documents);
      console.log(`A document was inserted with the _id: ${result.insertedId}`);
  } finally {
      await client.close();
  }
  }