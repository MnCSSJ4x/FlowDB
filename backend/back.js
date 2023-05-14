const express = require('express')
const app = express()
const fileUpload = require("express-fileupload");
const cors = require('cors');
const { MongoClient } = require('mongodb');
const pkg = require('csvtojson');
const bodyParser = require('body-parser');
const {csv} = pkg;
let count = 1;

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
    data.forEach((dataItem) =>{
      const result = dataItem.reduce((acc, obj) => {
        Object.entries(obj).forEach(([key, value]) => {
          if (!acc[key]) acc[key] = [];
          acc[key].push(value);
        });
        return acc;
      }, {});
      console.log(result)
      count+=1
      buildCollection(getClient(), result, count).catch(console.dir).then(()=>{
        runConstraints(getClient(), dataItem).catch(console.dir).then(()=>{
          
        })
      })
      // console.log(result);
    });
    res.json({"message":"gg"})
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

async function buildCollection(client, columns, count) {
  try {
      const database = client.db("testDB");
      const haiku = database.collection("temporary");
      const collectionName = "schema"+count;
      const name = database.collection(collectionName);
      // await name.insertOne({});
      const projection = columns.columnName.reduce((acc, curr) => ({ ...acc, [curr]: 1 }), {});

      // This is to validate the structure of the collection

      // const property = {};
      // // const typ = columns.dataType.map(DataType => ({ bsonType: DataType }));
      // const typ = {bsonType: 'string'}
      // // Loop through each column name and add its data type to the properties object
      // console.log(typ);
      // columns.columnName.forEach((columnName, index) => {
      //   property[columnName] = typ;
      // });
      // console.log(property)
      // const s = {
      //   $jsonSchema: {
      //   bsonType: "object",
      //   required: columns.columnName,
      //   properties: property,
      //   }
      // };
      // console.log(s)
      // const val = {validator:s}

      // const name = await database.createCollection(collectionName, val);

      const data = await haiku.find({}, {projection}).toArray()
      await name.insertMany(data, (err) =>{
          if (err) throw err;
      })
      console.log("HOYA")
      for(let i=0; i<columns.columnName.length; i++){
        console.log("HOYA")
        console.log(columns.columnName[i])
        console.log(columns.tempColName[i])
        const res = await name.updateMany(
          {}, {$rename: {[columns.columnName[i]]:columns.tempColName[i]}}
        )
        console.log(res)
      }

      //To typecase (Hardcoded for input collection of type)
      // {
      //   columnName: [ 'age' ],
      //   dataType: [ 'Integer' ],
      //   pk: [ 'f' ],
      //   nc: [ 'f' ],
      //   uc: [ 'f' ],
      //   fk: [ 'f' ],
      //   tempColName: [ 'ahr' ]
      // }
      await name.updateMany({}, { $set: { "ahr": { $toInt: "$ahr" } } });

      // for(let i=0; i<columns.columnName.length; i++){
      //   const attributeName = columns.columnName[i];
      //   console.log(`$${attributeName}`)
      //   switch (columns.dataType[i]) {
      //     case 'Integer':
      //       console.log("YEAHHH");
      //       const res = await name.updateMany(
      //         { [attributeName]: { $not: { $type: "number" } } },
      //         { $set: { [attributeName]: { $toInt: `$age` } } }
      //       )
      //       console.log(res)
      //       break;
      //     // Add more cases for other data types as needed
      //     default:
      //       break;
      //   }
      // }


  } finally {
      await client.close();
  }
}

async function runConstraints(client, columns) {
  try {
    const database = client.db("testDB");
    const collectionName = "schema"+count;
    const name = database.collection(collectionName);

    for (let i = 0; i < columns.length; i++) {
      const item = columns[i];

      if (item.nc == 1 && item.replaceWith == "none") {
        try {
          const query = { [item.columnName]: { $type: "null" } };
          const result = await name.deleteMany(query);
    
        } catch (err) {
          console.error(err);
        }
      }
      if(item.nc == 1 && item.replaceWith == "mean"){
        try{
          const avgResult = await name.aggregate([
            {
              $group: {
                _id: null,
                avgValue: { $avg: "$age" }
              }
            },
            {
              $project: {
                _id: 0,
                avgValue: 1
              }
            }
          ]).toArray();

          const result = await name.updateMany(
            { age: null },
            { $set: { age: avgResult[0].avgValue } }
          );
          console.log(`${result.modifiedCount} documents updated.`);

        }catch(err){
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
