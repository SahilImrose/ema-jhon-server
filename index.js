const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;

const port = 8080;

const app = express();


app.use(bodyParser.json());
app.use(cors())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.olhny.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db(process.env.DB_NAME).collection(process.env.DB_INDEX);

  app.get('/products', (req, res) => {
    productsCollection.find({})
      .toArray((err, document) => {
        res.send(document);
      })
  })


  app.get('/product/:key', (req, res) => {
    productsCollection.find({ key: req.params.key })
      .toArray((err, document) => {
        res.send(document[0]);
      })
  })
  app.post('/productByKey', (req, res) => {
    const productKeys = req.body;
    productsCollection.find({ key: { $in: productKeys } })
      .toArray((err, document) => {
        res.send(document);
      })
  })

  app.get('/', (req, res) => {
    res.send('hello world')
  })
  app.post('/addProduct', (req, res) => {
    const product = req.body;
    productsCollection.insertOne(product)
      .then(result => {
        console.log(result.insertedCount);
        res.send(result.insertedCount);
      })
  }



  );
})

app.listen(process.env.PORT || port)