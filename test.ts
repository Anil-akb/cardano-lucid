import { Blockfrost, Lucid } from "https://deno.land/x/lucid/mod.ts";

const lucid = await Lucid.new(
  new Blockfrost("https://cardano-preview.blockfrost.io/api/v0", "previewOtWqjufGKfJpdcTWi8q4dPZZrQ7T3iph"),
  "Preview",
);

const privateKey = lucid.utils.generatePrivateKey(); 
console.log("Private Key::",privateKey);

lucid.selectWalletFromPrivateKey(privateKey);


const address = await lucid.wallet.address();
console.log("The address ::",address);

const tx = await lucid.newTx()
  .payToAddress("addr_test1qp0x6p84n7ktwhyqcjnwsgpy0ywvqs929cgjlgjlxf0wpqa74ygpslpm995u4frtwgs3rd7ed0v2mwt3xjr2rmsulagsfk6yf8", { lovelace: 2000000n })
  .complete();

const signedTx = await tx.sign().complete();
const txHash = await signedTx.submit();

console.log("txHash=======::",txHash);