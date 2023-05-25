import {
  Blockfrost,
  Lucid,
  MintingPolicy,
  NFTMetadataDetails,
  Unit,
  TxHash,
  fromText,
  PolicyId,
} from "https://deno.land/x/lucid/mod.ts";

let lucid: Lucid;
let mintingPolicy: MintingPolicy;
let policyId: PolicyId;

const seed =
  "food next february void random diesel ice sound rain riot become easy lady nest kiwi april jewel later miracle mesh coral next twice liberty";

async function initializeLucid() {
  lucid = await Lucid.new(
    new Blockfrost(
      "https://cardano-preprod.blockfrost.io/api/v0",
      "preprodtyFN0EwaRtGhJEHaM8R0X5V29gXS78YQ"
    ),
    "Preprod"
  );

  await lucid.selectWalletFromSeed(seed);

  const addr = await lucid.wallet.address();
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
}

async function mintNFT(nftName: string): Promise<TxHash> {
  const unit: Unit = policyId + fromText(nftName);

  const nftMetadata: NFTMetadataDetails = {
    [policyId]: {
      [nftName]: {
        name: "anil",
        image: "ipfs://QmVcwkyDgVMrwM9USjbw8ZgCPY9GtNKLRcBqYGFNwHY4a9",
        mediaType: "image/jpg",
        description: "This NFT is minted by anil.",
      },
    },
  };

  const tx = await lucid
    .newTx()
    .mintAssets({ [unit]: 1 })
    .validTo(Date.now() + 600000)
    .attachMintingPolicy(mintingPolicy)
    .attachMetadata("721", nftMetadata)
    .complete();

  const signedTx = await tx.sign().complete();
  const txHash = await signedTx.submit();

  return txHash;
}

async function main() {
  try {
    await initializeLucid();
    const isMinted = await mintNFT("Bronze");
    console.log(isMinted ? "NFT has been minted" : "NFT has not been minted");
  } catch (error) {
    console.error("Error initializing Lucid:", error);
  }
}

main();
