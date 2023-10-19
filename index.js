const express = require('express')
const cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express()
const port = process.env.PORT || 50001

// middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.sxdrhxr.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
   serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
   }
});
async function run() {
   try {
      // Connect the client to the server	(optional starting in v4.7)
      await client.connect();

      const userCollection = client.db('futureTechHavenDB').collection('user');
      const productCollection = client.db('futureTechHavenDB').collection('product');
      const addCartsCollection = client.db('futureTechHavenDB').collection('myCart');

      // product
      app.get('/products',async(req,res) =>{
         const cursor = productCollection.find();
         const result = await cursor.toArray();
         res.send(result);
      });
// product id
      app.get('/products/:id',async(req,res) =>{
         const id = req.params.id;
         const query = {_id : new ObjectId(id)}
         const result = await productCollection.findOne(query);
         res.send(result);
      });
//  add products
      app.post('/products',async(req,res) =>{
         const product = req.body;
         console.log(product);
         const result = await productCollection.insertOne(product);
         res.send(result);
      });
      // add to card products
      app.post('/addToCarts',async(req,res) =>{
         const cartProduct = req.body;
         console.log(cartProduct);
         const result = await addCartsCollection.insertOne(cartProduct);
         res.send(result);
      });
   // update product
   app.put('/products/:id',async(req,res) =>{
      const id = req.params.id;
      const filter = {_id : new ObjectId(id)}
      const options = {upsert : true}
      const updatedProduct = {
         $set: {
            // name,brand,type,price,short_description,rating,photo,details
            name:req.body.name, 
            brand:req.body.brand, 
            type:req.body.type, 
            price:req.body.price, 
            short_description:req.body.short_description, 
            rating:req.body.rating, 
            photo:req.body.photo, 
            details:req.body.details, 
         }
      }
      const result = await productCollection.updateOne(filter, updatedProduct, options);
      res.send(result)
    })

      // user
      app.post('/user', async (req, res) => {
         const user = req.body;
         console.log(user);
         const result = await userCollection.insertOne(user);
         res.send(result);
      });
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
   } finally {
      // Ensures that the client will close when you finish/error
      //  await client.close();
   }
}
run().catch(console.dir);

app.get('/', (req, res) => {
   res.send("All Ok!!")
})

app.listen(port, () => {
   console.log(`Server is running on port: ${port}`)
})