const express = require("express");
const bodyParser = require("body-parser");
const BlockChain = require("./blockchain");
const PubSub = require("./pubsub");

const app = express();
const blockchain = new BlockChain();
const pubsub = new PubSub({ blockchain });

setTimeout(() => pubsub.broadcastChain(), 1000);

app.use(bodyParser.json());

const api = "/api";

app.get(`${api}/blocks`, (req, res) => {
    res.json(blockchain.chain);
});

app.post(`${api}/mine`, (req, res) => {
    const { data } = req.body;
    blockchain.addBlock({ data });
    res.redirect(`${api}/blocks`);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`API running in http://localhost:${port}${api}`);
});