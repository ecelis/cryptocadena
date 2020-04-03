const express = require("express");
const BlockChain = require("./blockchain");

const app = express();
const blockchain = new BlockChain();

app.get("/api/blocks", (req, res) => {
    res.json(blockchain.chain);
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`API running in http://localhost:${port}`);
});