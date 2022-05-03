const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000 ;

const app =express()
//  middale ware  //
app.use(cors())
app.use(express.json());  




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@warehouse.48or3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });


console.log(uri);

async function run(){
try{
  await client.connect()
  const inventoryCollection = client.db('electronicsWarehouse').collection('inventory')
app.get('/inventory',async(req,res)=>{
const query = {}
const cursor = inventoryCollection.find(query)
const inventory = await cursor.toArray()
res.send(inventory)

})


}
finally{

}


}
run().catch(console.dir)



app.get('/',(req,res)=>{
  res.send('running electronics warehouse surver ')
})
app.listen(port,()=>{
  console.log('listening to port',port);
})