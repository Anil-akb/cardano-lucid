const express = require('express')
const colors = require('colors')
const bodyParser = require("body-parser");
const app = express()

const {mintNFT, burnNFT } = require('./mint_simple_nft')


app.use(bodyParser.json())


app.post("/mint-nft", async (req, res) => {
    const name = req.body.name;
    const txHash = await mintNFT(name);
    res.send({ txHash });
  });

  app.post("/burn-nft", async (req, res) => {
    const name = req.body.name;
    const txHash = await burnNFT(name);
    res.send({ txHash });
  });


  app.listen(8080,() => {
    console.log('server is running'.bgGreen)
})
