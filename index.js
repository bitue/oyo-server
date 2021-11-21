const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5000;


// add middle were 
app.use(cors())
app.use(express.json())

// dataBase client info 

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1ytj1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const hotelDatabase = client.db("hotel-services");
        const collectionHotel = hotelDatabase.collection("collection-hotel-services");
        const bookingCollection = hotelDatabase.collection('collection-booking-hotel');
        const userCollection = hotelDatabase.collection('collection-user')
        console.log('database connected')
        //create all services data api 
        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = await collectionHotel.find(query).toArray()
            res.send(cursor)
        })

        //create single selected service api 

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;


            const query = { _id: ObjectId(id) }
            const cursor = await collectionHotel.findOne(query)
            res.send(cursor)

        })

        // insert booking details

        app.post('/services/mybooking', async (req, res) => {
           
            const result = await bookingCollection.insertOne(req.body)
            res.send(result)
        })

        app.get('/services/myBookings/:email', async (req, res) => {
           


            const result = await bookingCollection.find({ email: req.params.email }).toArray()
            res.send(result)



        })

        // manage all orders 

        app.get('/manageOrder', async (req, res) => {
            const result = await bookingCollection.find({}).toArray();
            res.send(result)
        })

        //delete specific booking

        app.delete('/services/cancel/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await bookingCollection.deleteOne(query)
            res.send(result)
           
        })

        // delete

        app.delete('/services/all/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await bookingCollection.deleteOne(query)
            res.send(result)
           

        })

        //post method to create another services

        app.post('/createService', async (req, res) => {
            const service = req.body;
            const result = await collectionHotel.insertOne(service)
            res.send(result)
        })

        // add email of user 

        app.post('/notify', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result)

        })

        //updated status here 

        app.put('/update/status', async (req, res) => {
            
            const id = req.body.serviceId;
            const filter = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    status: 'Approved'
                },
            };
            const result = await bookingCollection.updateOne(filter,updateDoc)
            res.send(result)

        })


    }
    finally {
        // await client.close()
    }
}
run().catch(console.dir)




app.get('/', (req, res) => {
    res.send('server of OYO is running..........')
})

app.listen(port, () => {
    console.log('server is running now at ', port)
})