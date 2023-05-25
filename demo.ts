import {
  Blockfrost,
  Lucid,
  NFTMetadataDetails,
  MintingPolicy,
  PolicyId,
} from "https://deno.land/x/lucid@0.10.4/mod.ts"";

const secretSeed =
  "unhappy hammer slow nephew nominee sudden meat office wrist just alpha spirit roof design grace sad inquiry nose reopen dismiss diary leader come play";

let lucid: Lucid;
let mintingPolicy: MintingPolicy;
let policyId: PolicyId;

Lucid.new(
  new Blockfrost(
    "https://cardano-preprod.blockfrost.io/api/v0",
    "preprodtyFN0EwaRtGhJEHaM8R0X5V29gXS78YQ"
  ),
  "Preprod"
)
  .then((res) => {
    lucid = res;
    return lucid.selectWalletFromSeed(secretSeed);
  })
  .then(() => {
    return lucid.wallet.address();
  })
  .then((addr) => {
    const { paymentCredential } = lucid.utils.getAddressDetails(addr);

    mintingPolicy = lucid.utils.nativeScriptFromJson({
      type: "all",
      scripts: [
        { type: "sig", keyHash: paymentCredential?.hash! },
        {
          type: "before",
          slot: lucid.utils.unixTimeToSlot(Date.now() + 1000000),
        },
      ],
    });

    policyId = lucid.utils.mintingPolicyToId(mintingPolicy);
    console.log(policyId, "my policy id");

  })

    const metadata: NFTMetadataDetails = {
      name: "quotus nft",
      description: "This is my NFT",
      image: "ipfs://QmNfvdYEGQA9AM5mSKXRHzJz2GA8nwSxpAs75DuJvdQs2F",
    };

    mintNFT(metadata)
      .then((txHash) => {
        console.log("NFT minted. Transaction Hash:", txHash);
      })
      .catch((error) => {
        console.error("Error minting NFT:", error);
      });
    .catch((error) => {
    console.error("Error initializing Lucid:", error);
     });

// async function mintNFT(metadata: NFTMetadataDetails) {
//   const tx = await lucid
//     .newTx()
//     .validTo(Date.now() + 600000)
//     .mintAssets({ [policyId]: 1 })
//     .attachMetadata("721", metadata)
//     .complete();

//   const signedTx = await tx.sign().complete(); // Include the signing key as a parameter
//   const txHash = await signedTx.submit();

//   return txHash;
// }

async function mintNFT(metadata: NFTMetadataDetails) {
  const tx = await lucid
    .newTx()
    .validTo(Date.now() + 600000)
    .mintAssets({ [policyId]: [{ quantity: 1, assetName: "NFT" }] }) // Specify the assetName as "NFT" with quantity 1
    .attachMetadata("721", metadata)
    .complete();

  const signedTx = await tx.sign([signingKey]).complete();
  const txHash = await signedTx.submit();

  return txHash;
}
