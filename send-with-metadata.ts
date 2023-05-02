// SEND ADA WITH METADATA

import {
    Blockfrost,
    Lucid,
   } from "https://deno.land/x/lucid@0.8.3/mod.ts";

   const lucid = await Lucid.new(
    new Blockfrost(
    "https://cardano-preview.blockfrost.io/api/v0",
    "previewyloEMHSaShPie75QF4xvwhtJjLCeVh1l",
    ),
    "Preview",
   );

lucid.selectWalletFromPrivateKey(await Deno.readTextFile("./wallet2.sk"));

const metadata = "hello cardano metadata , Created by Anil Kumar Barik"

const tx = await lucid.newTx()
  .payToAddress("addr_test1vzcphg8l75d36yh3w0y3f85q5mydtw42vag7kktw3tc73jsezame0", { lovelace: 10000000n })
  .attachMetadata(674, metadata)
  .complete();

const signedTx = await tx.sign().complete();

const txHash = await signedTx.submit();
// console.log(details);
console.log(txHash);