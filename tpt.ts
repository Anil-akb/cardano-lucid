// |Transaction per transaction
// deno run --allow-net --allow-read <file name>

import {Blockfrost, Lucid} from "https://deno.land/x/lucid@0.8.3/mod.ts";

const lucid = await Lucid.new(
    new Blockfrost(
    "https://cardano-preview.blockfrost.io/api/v0",
    "previewyloEMHSaShPie75QF4xvwhtJjLCeVh1l",
    ),
    "Preview",
   );

lucid.selectWalletFromPrivateKey(await Deno.readTextFile("./wallet2.sk"));

const tx = await lucid.newTx()
  .payToAddress("addr_test1vzcphg8l75d36yh3w0y3f85q5mydtw42vag7kktw3tc73jsezame0", { lovelace: 10000000n })
  .payToAddress("addr_test1vzcphg8l75d36yh3w0y3f85q5mydtw42vag7kktw3tc73jsezame0", { lovelace: 10000000n })
  .payToAddress("addr_test1vzcphg8l75d36yh3w0y3f85q5mydtw42vag7kktw3tc73jsezame0", { lovelace: 10000000n })
  .payToAddress("addr_test1vzcphg8l75d36yh3w0y3f85q5mydtw42vag7kktw3tc73jsezame0", { lovelace: 10000000n })
  .payToAddress("addr_test1vzcphg8l75d36yh3w0y3f85q5mydtw42vag7kktw3tc73jsezame0", { lovelace: 10000000n })
  .payToAddress("addr_test1vzcphg8l75d36yh3w0y3f85q5mydtw42vag7kktw3tc73jsezame0", { lovelace: 10000000n })
  .payToAddress("addr_test1vzcphg8l75d36yh3w0y3f85q5mydtw42vag7kktw3tc73jsezame0", { lovelace: 10000000n })
  .payToAddress("addr_test1vzcphg8l75d36yh3w0y3f85q5mydtw42vag7kktw3tc73jsezame0", { lovelace: 10000000n })
  .payToAddress("addr_test1vzcphg8l75d36yh3w0y3f85q5mydtw42vag7kktw3tc73jsezame0", { lovelace: 10000000n })
  .payToAddress("addr_test1vzcphg8l75d36yh3w0y3f85q5mydtw42vag7kktw3tc73jsezame0", { lovelace: 10000000n })
  .complete();

const signedTx = await tx.sign().complete();
let currentTime = new Date();
let hours = currentTime.getHours().toString().padStart(2, '0');
let minutes = currentTime.getMinutes().toString().padStart(2, '0');
let seconds = currentTime.getSeconds().toString().padStart(2, '0');

const txHash = await signedTx.submit();
// console.log(details);
console.log(txHash, `${hours}:${minutes}:${seconds}`);

