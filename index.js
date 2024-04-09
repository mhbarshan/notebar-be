const connectToMongo = require('./db')
const express = require('express')
var cors = require('cors')
 


connectToMongo();
const app = express()
const host = "https://notebar-be.onrender.com" 

app.use(cors())
app.use(express.json())

//Available routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))



app.listen(host, () => {
  console.log(`NoteBar Backend listening on port ${host}`)
})
