const express = require('express')  
const app =express()
const cors = require('cors')
const { MongoClient, ServerApiVersion ,ObjectId } = require('mongodb');
require('dotenv').config()
const jwt = require('jsonwebtoken')
const port = process.env.PORT || 5000 ;





//  middale ware  //
app.use(cors())
app.use(express.json()); 

//  verifying jwt token  //
// process.env.ACCESS_TOKEN_SECRET

function verifyJWT(req,res,next){
  const authHeader = req.headers.authorization
  // console.log(authHeader);
  if(!authHeader){
    return res.status(401).send({message:'unauthorized access'})
  }
  const token = authHeader.split(' ')[1]
  jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,decoded)=>{
    // if(err){
    //   return res.status(403).send({message:'forbidden access'})
    // }
    // console.log('decoded' ,decoded);
    req.decoded = decoded
    next()
  })
}



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@warehouse.48or3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


// console.log(uri);

async function run(){
try{
  await client.connect()
  const inventoryCollection = client.db('electronicsWarehouse').collection('inventory')

  //auth  
 
app.post('/login',async (req,res)=>{
const user = req.body
const accessToken = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{
  expiresIn:'1d'
})
res.send({accessToken})
})

// service api 
app.get('/inventory',async(req,res)=>{
const query = {}
const cursor = inventoryCollection.find(query)
const inventory = await cursor.toArray()
res.send(inventory)

})

app.put('/inventory/:id',async(req,res)=>{
  const id =req.params.id 
  const updateQuantity =req.body; 
  // console.log(updateQuantity.quantity);
  const filter = {_id:ObjectId(id)}
  const options = {upsert:true}
  const updateDoc = {
    $set: {quantity:updateQuantity.quantity}
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
app.get('/myitems',verifyJWT, async(req,res)=>{
  // const authHeader = req.headers.authorization
  // console.log(authHeader);
  // const decodedEmail = req.decoded.email
  const email = req.query.email 
  // console.log(email);
  // if(email === decodedEmail){
    const query = {email: email}
    const cursor = await inventoryCollection.find(query).toArray()
    res.send(cursor)

  // }
  // else{
  //   res.status(403).send({message:'Forbidden access'})
  // }

})



app.delete('/myitems/:id',async(req,res)=>{
  const id =req.params.id 
  const query = {_id:ObjectId(id)}
  const result = await inventoryCollection.deleteOne(query)
  res.send(result)
})


app.post('/additems', async(req,res)=>{
  const order = req.body
  const result = await inventoryCollection.insertOne(order)
  // console.log(result);
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