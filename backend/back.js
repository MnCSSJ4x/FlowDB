const express = require('express')
const app = express()
const cors = require('cors');

const port = 4000

app.use(cors()); // Enable CORS for all routes

app.get('/upload', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
