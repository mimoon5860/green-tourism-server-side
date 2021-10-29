const express = require('express');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 5000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1051k.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri);

async function run() {
    const database = client.db("tourism");
    const toursCollection = database.collection("tours");
    const tourJoined = database.collection("joined");


    // Get All Tour Api 
    try {
        app.get('/tours', async (req, res) => {
            await client.connect();
            const cursor = toursCollection.find({});
            const tours = await cursor.toArray();
            res.send(tours);
        })

    } finally {
        await client.close();
    }


    // Get Single Tour Api 
    try {
        app.get('/tour/:id', async (req, res) => {
            await client.connect();
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const tour = await toursCollection.findOne(query);
            res.send(tour);
        })
    } finally {
        await client.close();
    }

    // Post Joined Tour 
    try {
        app.post('/joinedtour', async (req, res) => {
            await client.connect();
            const newJoined = req.body;
            const result = await tourJoined.insertOne(newJoined);
            res.json(result);
        })
    } finally {
        await client.close();
    }

    // Get All joined Tours
    try {
        app.get('/alljoinedTours', async (req, res) => {
            await client.connect();
            const cursor = tourJoined.find({});
            const joinedTour = await cursor.toArray();
            res.send(joinedTour);
        })
    } finally {
        await client.close();
    }

    // get single users joined tours by post 

    try {
        app.post('/joinedtours/byuser', async (req, res) => {
            await client.connect();
            const userEmail = req.body;
            console.log(userEmail);
            const query = { email: { $in: userEmail } };
            const userTours = await tourJoined.find(query).toArray();
            res.json(userTours);
        })
    } finally {
        await client.close();
    }

    // delete Single users joined tour 
    try {
        app.delete('/deleteJoinedTour/:id', async (req, res) => {
            await client.connect();
            const id = req.params.id;
            console.log(id)
            const query = { _id: ObjectId(id) };
            const result = await tourJoined.deleteOne(query);
            res.send(result)
        })
    } finally {
        await client.close();
    }

    // get every single joined tour 
    try {
        app.get('/joinedtour/:id', async (req, res) => {
            await client.connect();
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const tour = await tourJoined.findOne(query);
            res.send(tour);
        })
    } finally {
        await client.close();
    }

    // update single user joined status 
    try {
        app.put('joinedtour/:id', async (req, res) => {
            await client.connect();

            const id = req.params.id;
            const updateStatus = req.body;

            console.log(id, updateStatus);
            // const filter = { _id: ObjectId(id) };
            // const options = { upsert: true };
            // const updateStatus = {
            //     $set: {
            //         status: updateStatus
            //     }
            // };

            // const result = await tourJoined.updateOne(filter, updateStatus, options);

            res.json("hitted")

        })
    } finally {
        await client.close();
    }

}
run().catch(console.dir);





app.get('/', async (req, res) => {
    res.send("Tourism server running enjoy...")
})

app.listen(port, () => {
    console.log('listining to port ', port)
})