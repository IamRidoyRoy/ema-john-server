const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('John Server is running');
})

app.listen(port, () => {
    console.log('John is listening to port', port)
})


// Connect with MongoDB

const { MongoClient, ServerApiVersion } = require('mongodb');
const { get } = require('express/lib/response');
const uri = `mongodb+srv://emajohndb1:9VzHM3vvneGfS5N@cluster0.zg2ow.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        const productCollection = client.db('emajohn').collection('product');

        app.get('/product', async (req, res) => {
            console.log('query', req.query);
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            const query = {};
            const cursor = productCollection.find(query);
            let products;
            if (page, size) {
                // page 0 -->skip 0*0 get: (0-10) (10):
                // page 1 -->skip 1*10 get: (11-20) (10):
                products = await cursor.skip(page * size).limit(size - 1).toArray();

            }
            else {
                products = await cursor.toArray();
            }
            res.send(products)
        })

        app.get('/productcount', async (req, res) => {
            const count = await productCollection.estimatedDocumentCount();
            res.send({ count });
        })

    }
    finally {

    }
}

run().catch(console.dir);
