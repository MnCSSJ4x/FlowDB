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
app.post('/query', (req, res)=>{
  console.log(req.body);
  res.json({"message":"gg"});
})
app.post('/schema', (req, res)=>{
    structure = []
    const data = req.body;
    const promises = data.map((dataItem) =>{
      const result = dataItem.reduce((acc, obj) => {
        Object.entries(obj).forEach(([key, value]) => {
          if (!acc[key]) acc[key] = [];
          acc[key].push(value);
        });
        return acc;
      }, {});
      console.log(result)
      count+=1
      return buildCollection(getClient(), result, count).then((name)=>{
        console.log("running constraints...")
        return runConstraints(getClient(), dataItem, name).then((struct)=>{
          structure.push(struct);
          console.log(struct)
          console.log("Okay done!");
          return struct;
        })
      })
    })
    Promise.all(promises).then(() => {
      res.json({"data": structure})
    }).catch((error) => {
      console.error(error);
      res.status(500).json({"error": "Something went wrong."});
    });
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

      const data = await haiku.find({}, {projection}).toArray()
      await name.insertMany(data, (err) =>{
          if (err) throw err;
      })
      for(let i=0; i<columns.columnName.length; i++){
        if(columns.columnName[i] == columns.tempColName[i]) continue;
        const res = await name.updateMany(
          {}, {$rename: {[columns.columnName[i]]:columns.tempColName[i]}}
        )
        console.log(res)
      }

      proj = {}
      for(let i=0; i<columns.dataType.length; i++){
        if(columns.dataType[i] == "Integer"){
          columns.dataType[i] = "double"
        }
      }
      for(let i=0; i<columns.tempColName.length; i++){
        console.log(columns.tempColName[i])
        proj[columns.tempColName[i]] = {$convert: {input: `$${columns.tempColName[i]}`, to: columns.dataType[i], onError: null}}
      }
      const pipeline = [{
          $project: proj
    }];

      // Run the aggregation pipeline and update the collection
      const results = await name.aggregate(pipeline).toArray(); // Print the converted documents
      // console.log(results)
        // Replace the old documents with the converted documents
      await name.deleteMany({})
      await name.insertMany(results, (err)=>{
        if(err) throw err;
      });
      return collectionName;
  } finally {
      await client.close();
  }
}

async function runConstraints(client, columns, collectionName) {
  try {
    const database = client.db("testDB");
    // const collectionName = "schema"+count;
    const name = database.collection(collectionName);
    console.log(collectionName)

    for (let i = 0; i < columns.length; i++) {
      const item = columns[i];

      if (item.nc == 1 && item.replaceWith == "delete") {
        try {
          console.log("Deleting NULLs for" + item.tempColName)
          const query = { [item.tempColName]: { $type: "null" } };
          const result = await name.deleteMany(query);
          console.log(result)
        } catch (err) {
          console.error(err);
        }
      }
      if(item.nc == 1 && item.replaceWith == "mean"){
        try{
          console.log("Replacing mean for " + `$${item.tempColName}`)
          const avgResult = await name.aggregate([
            {
              $group: {
                _id: null,
                avgValue: { $avg: `$${item.tempColName}`.toString() }
              }
            },
            {
              $project: {
                _id: 0,
                avgValue: 1
              }
            }
          ]).toArray();
          console.log(avgResult)
          const result = await name.updateMany(
            { [item.tempColName]:null },
            { $set: {[item.tempColName]: avgResult[0].avgValue } }
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
                  _id: { field1: `$${item.tempColName}` },
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
    const sampleDoc = await name.findOne({});
    const columnNames = Object.keys(sampleDoc);
    console.log(columnNames)
    const prop = {[collectionName]:columnNames}
    console.log(prop)
    return prop;
  } finally {
    await client.close();
  }
}
