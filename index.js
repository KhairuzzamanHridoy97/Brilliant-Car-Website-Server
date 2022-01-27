const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId=require('mongodb').ObjectId;
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 5000;

//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.bttmq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri)

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
        try{
            await client.connect();
            const database = client.db('brilliantCar');
            const serviceCollection = database.collection('services');

            // GET API
            app.get('/services',async(req,res)=>{
                const cursor = serviceCollection.find({});
                const services= await cursor.toArray();
                res.send(services);
            }) ;   

            // get single Service

            app.get('/services/:id',async(req,res)=>{
                const id = req.params.id;
                const query = {_id:ObjectId(id)}
                // check
                console.log('get the id',id)
                const service = await serviceCollection.findOne(query)
                res.json(service)
            });

            // POST API
            app.post('/services',async(req,res)=>{
                const service= req.body
                console.log('Hit the post API',service)
                // res.send('The Post Hitted')

                const result =await serviceCollection.insertOne(service);
                console.log(result)
                res.json(result);

            });

            // Delete Operation
            app.delete('/services/:id',async(req,res)=>{
                const id = req.params.id;
                const quary ={_id:ObjectId(id)};
                const result = await serviceCollection.deleteOne(quary);
                res.json(result)
                
            })
        }
        finally{
            // await client.close();
        }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('Brilliant Car Server')
})

app.listen(port,()=>{
    console.log('Run This server on port ',port)
})