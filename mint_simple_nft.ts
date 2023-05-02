import {
  Blockfrost,
  fromText,
  Lucid,
  MintingPolicy,
  PolicyId,
  TxHash,
  Address,
  Unit,
  Assets
} from "https://deno.land/x/lucid/mod.ts";

// const lucid = await Lucid.new();
import { secretSeed } from "./seed.ts";

/*
    MintSimpleNFT Example
    Mint or burn a simple NFT.
   */

const lucid = await Lucid.new(
  new Blockfrost(
    "https://cardano-preprod.blockfrost.io/api/v0",
    "preprodUFORB61aetgYVPS7c1qGhven5shd9cjE"
  ),
  "Preprod"
);

lucid.selectWalletFromSeed(secretSeed);
const addr: Address = await lucid.wallet.address();
console.log(addr, "this is address");

// const api = await window.cardano.nami.enable();
// // Assumes you are in a browser environment
// lucid.selectWallet(api);

const { paymentCredential } = lucid.utils.getAddressDetails(
  await lucid.wallet.address()
);

const mintingPolicy: MintingPolicy = lucid.utils.nativeScriptFromJson({
  type: "all",
  scripts: [
    { type: "sig", keyHash: paymentCredential?.hash! },
    {
      type: "before",
      slot: lucid.utils.unixTimeToSlot(Date.now() + 1000000),
    },
  ],
});

const policyId: PolicyId = lucid.utils.mintingPolicyToId(mintingPolicy);
console.log(policyId, "my policy id");

export async function mintNFT(name: string): Promise<TxHash> {
  const unit: Unit = policyId + fromText(name);

  const tx = await lucid
    .newTx()
    .mintAssets({ [unit]: 2n })
    .validTo(Date.now() + 100000)
    .attachMintingPolicy(mintingPolicy)
    .complete();

  const signedTx = await tx.sign().complete();

  const txHash = await signedTx.submit();

  return txHash;
}

// const policyId: PolicyId = "a4d8bf12129d40b44ce273a0370cd3b7cb834bd8db8cc6381e83f695"


// to check nft minted or not
const isMinted = await mintNFT("rest-api");
console.log(isMinted ? "NFT has been minted" : "NFT has not been minted");

// // get wallet balance
// const utxos = await lucid.wallet.getUtxos();
// console.log(`Wallet balance: ${utxos} lovelaces`);




// Get the wallet UTxo



// const balance = await lucid.wallet.getUtxos();
// console.log("-------------------------------")
// console.log(balance,"+++++++")


// const assets = await lucid.wallet.Assets();
// console.log(assets);


// get transaction history
// const txHistory = await lucid.wallet.getTxHistory();
// console.log(txHistory,"Transaction history");


export async function burnNFT(name: string): Promise<TxHash> {
  const unit: Unit = policyId + fromText(name);

  const tx = await lucid
    .newTx()
    .mintAssets({ [unit]: -1n })
    .validTo(Date.now() + 100000)
    .attachMintingPolicy(mintingPolicy)
    .complete();

  const signedTx = await tx.sign().complete();

  const txHash = await signedTx.submit();

  return txHash;
}
// const isBurned = await burnNFT("MyNFT");
// console.log(isBurned ? "NFT has been burned" : "NFT has not been burned");


module.exports = mintNFT, burnNFT