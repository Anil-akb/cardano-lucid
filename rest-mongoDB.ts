// succefully tested


import { Lucid } from "https://deno.land/x/lucid@0.8.3/mod.ts";
import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { MongoClient } from "https://deno.land/x/mongo/mod.ts";

const app = new Application();
const router = new Router();

// Set up Lucid
const lucid = await Lucid.new(undefined, "Preview");

// Set up MongoDB
const client = new MongoClient();
await client.connect(
  "mongodb+srv://anil-123:Anil@123@cardano.ckvidkr.mongodb.net/myDB?authMechanism=SCRAM-SHA-1",
);
const db = client.database("mydb");
const walletCollection = db.collection("wallets");

// Define API routes
router.get("/wallets-details", async (ctx) => {
  const wallets = await walletCollection.find();
  ctx.response.body = { wallets: await wallets.toArray() };
});


router.post("/wallets", async (ctx) => {
  // Generate private key and address
  const privateKey = lucid.utils.generatePrivateKey();
  const address = await lucid.selectWalletFromPrivateKey(privateKey).wallet.address();

  // Store in MongoDB
  const { insertedId } = await walletCollection.insertOne({ privateKey, address });

  ctx.response.status = 201;
  ctx.response.body = { id: insertedId, privateKey, address };
});

// Set up middleware
app.use(router.routes());
app.use(router.allowedMethods());

// Start server
console.log("Server listening on http://localhost:8000");
await app.listen({ port: 8000 });
