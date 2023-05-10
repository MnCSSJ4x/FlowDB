const express = require('express')
const app = express()
const fileUpload = require("express-fileupload");
const cors = require('cors');

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
      res.json(200)
    }
  });
  

})
const port = 4000
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
