// SEND 10 ADA ONE WALLET TO ANOTHER WALLET

import { Blockfrost, Lucid } from "https://deno.land/x/lucid@0.8.3/mod.ts";

const lucid = await Lucid.new(
  new Blockfrost(
    "https://cardano-preview.blockfrost.io/api/v0",
    "preprodtyFN0EwaRtGhJEHaM8R0X5V29gXS78YQ"
  ),
  "Preprod"
);

//wallet 2 private key
lucid.selectWalletFromPrivateKey(await Deno.readTextFile("./newWallet.sk"));

//wallet 1 address
const tx = await lucid
  .newTx()
  .payToAddress(
    "addr_test1vptxxt66l9da753c98kk0dvyuscp542sz4d73cpmeg0nrdg0v305k",
    { lovelace: 10000000n }
  )
  .complete();

const signedTx = await tx.sign().complete();

const txHash = await signedTx.submit();

let currentTime = new Date();
let hours = currentTime.getHours().toString().padStart(2, "0");
let minutes = currentTime.getMinutes().toString().padStart(2, "0");
let seconds = currentTime.getSeconds().toString().padStart(2, "0");

// console.log(details);
console.log(txHash, `${hours}:${minutes}:${seconds}`);

// 598b7c0f4c957449cfa7bfddc2636eabe968e74a951fe4b33f0d2aab8a9dd39e
