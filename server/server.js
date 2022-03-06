console.log("server is starting");

var express = require("express");
var cors = require("cors");
var app = express();
require("dotenv").config();

const MongoClient = require("mongodb").MongoClient;

MongoClient.connect(
  process.env.CONNECTION_URL
)
  .then((client) => {
    console.log("Connected to MongoDB");
    const db = client.db("reation-time-scores");
    const scores = db.collection("scores");

    app.use(express.json());
    app.use(cors());

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {console.log("listening. . .")});

    app.get("/", (req, res) => {
      res.send("Welcome to reactiom-time-api!");
    });

    app.post("/scores", (req, res) => {
      const data = req.body;
      data.timestamp = Date.now();
      console.log(data);
      scores.insertOne(data);
      res.json(data);
    });

    app.get("/scores", async (req, res) => {
      const options = {
        sort: {score: 1}
      }
      const data = await db.collection('scores').find({}, options).toArray();
      res.send(data);
    });

  })
  .catch(console.error);