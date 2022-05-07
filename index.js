const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion ,ObjectId } = require('mongodb');
require('dotenv').config()
const port = process.env.PORT || 5000 ;

const app =express()
//  middale ware  //
app.use(cors())
app.use(express.json());  




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@warehouse.48or3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


console.log(uri);

async function run(){
try{
  await client.connect()
  const inventoryCollection = client.db('electronicsWarehouse').collection('inventory')
  const newCollection = client.db('electronicsWarehouse').collection('newInvetory')
app.get('/inventory',async(req,res)=>{
const query = {}
const cursor = inventoryCollection.find(query)
const inventory = await cursor.toArray()
res.send(inventory)

})

app.put('/inventory/:id',async(req,res)=>{
  const id =req.params.id 
  const updateQuantity =req.body; 
  const filter = {_id:ObjectId(id)}
  const options = {upsert:true}
  const updateDoc = {
    $set: {updateQuantity}
  }

  const result = await inventoryCollection.updateOne(filter,updateDoc,options)
  res.send(result)

})

app.get('/inventory/:id',async(req,res)=>{
  const id =req.params.id 
  const query = {_id:ObjectId(id)}
  const result = await inventoryCollection.findOne(query)
  res.send(result)

})

app.delete('/inventory/:id',async(req,res)=>{
  const id =req.params.id 
  const query = {_id:ObjectId(id)}
  const result = await inventoryCollection.deleteOne(query)
  res.send(result)
})


// my items  section //
app.get('/myitems',async(req,res)=>{
const query = {}
const cursor = newCollection.find(query)
const newInventory = await cursor.toArray()
res.send(newInventory)

})

app.delete('/myitems/:id',async(req,res)=>{
  const id =req.params.id 
  const query = {_id:ObjectId(id)}
  const result = await newCollection.deleteOne(query)
  res.send(result)
})


app.post('/addItems',async(req,res)=>{
  const order = req.body
  const result = await newCollection.insertOne(order)
  console.log(result);
  res.send(result)
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