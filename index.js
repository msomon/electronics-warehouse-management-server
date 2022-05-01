const express = require('express')
const cors = require('cors')
const app =express()
const { MongoClient, ServerApiVersion } = require('mongodb');
const port = process.env.PORT || 5000
require('dotenv').config()
//  middale ware  //
app.use(cors())
app.use(express.json());  



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@warehouse.48or3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });




app.get('/',(req,res)=>{
  res.send('running electronics warehouse surver ')
})
app.listen(port,()=>{
  console.log('listening to port',port);
})