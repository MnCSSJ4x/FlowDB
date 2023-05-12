const express = require('express')
const app = express()
const fileUpload = require("express-fileupload");
const cors = require('cors');
const { MongoClient } = require('mongodb');
const pkg = require('csvtojson');
const bodyParser = require('body-parser');
const {csv} = pkg;


app.use(cors()); 
app.use(bodyParser.json());
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
    // console.log("OKAY RECIEVED")
    const data = req.body;
    console.log(data[0])
    const result = data[0].reduce((acc, obj) => {
      Object.entries(obj).forEach(([key, value]) => {
        if (!acc[key]) acc[key] = [];
        acc[key].push(value);
      });
      return acc;
    }, {});
    
    buildCollection(getClient(), result).catch(console.dir).then(()=>{
      runConstraints(getClient(), data[0]).catch(console.dir).then(()=>{
        res.json({"message":"gg"})
      })
    })
    // console.log(req.body);
})


const port = 4000
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});

function getClient() {
const uri = "mongodb://0.0.0:27017/";
return new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
}


async function queryValues(client){
  try{
      const database = client.db("testDB");
      const table = database.collection("temporary");
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

async function buildCollection(client, columns) {
  try {
      const database = client.db("testDB");
      const haiku = database.collection("temporary");
      const name = database.collection("schema1");
      const projection = columns.columnName.reduce((acc, curr) => ({ ...acc, [curr]: 1 }), {});
      const data = await haiku.find({}, {projection}).toArray()
      await name.insertMany(data, (err) =>{
          if (err) throw err;
      })
  } finally {
      await client.close();
  }
}

async function runConstraints(client, columns) {
  try {
    const database = client.db("testDB");
    const name = database.collection("schema1");

    for (let i = 0; i < columns.length; i++) {
      const item = columns[i];

      if (item.nc == 1) {
        try {
          const query = { [item.columnName]: { $type: "null" } };
          const result = await name.deleteMany(query);
          console.log(result);
        } catch (err) {
          console.error(err);
        }
      }
      if (item.uc == 1) {
        try {
          const duplicates = await name
            .aggregate([
              {
                $group: {
                  _id: { field1: "$age" },
                  count: { $sum: 1 },
                  docs: { $push: "$_id" },
                },
              },
              {
                $match: {
                  count: { $gt: 1 },
                },
              },
              {
                $unwind: "$docs",
              },
            ])
            .toArray();

          const deletePromises = duplicates.map(({ docs }) =>
            name.deleteOne({ _id: docs })
          );
          await Promise.all(deletePromises);
          console.log("Duplicates removed");
        } catch (err) {
          console.error(err);
        }
      }
    }

    // const projection = columns.columnName.reduce((acc
    // const data = await haiku.find({}, {projection}).toArray()
    // await name.insertMany(data, (err) =>{
    //     if (err) throw err;
    // })
  } finally {
    await client.close();
  }
}
