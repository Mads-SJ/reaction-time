console.log("server is starting");

var express = require("express");
var cors = require("cors");
var app = express();

const MongoClient = require("mongodb").MongoClient;

MongoClient.connect(
  "mongodb+srv://admin:bqf55mdw@cluster0.q2yau.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
)
  .then((client) => {
    console.log("Connected to MongoDB");
    const db = client.db("reation-time-scores");
    const scores = db.collection("scores");

    app.use(express.json());
    app.use(cors());

    app.listen(3000, () => {console.log("listening. . .")});

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