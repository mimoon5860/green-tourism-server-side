const express = require('express');
const cors = require('cors');
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


}
run().catch(console.dir);





app.get('/', async (req, res) => {
    res.send("Tourism server running enjoy...")
})

app.listen(port, () => {
    console.log('listining to port ', port)
})