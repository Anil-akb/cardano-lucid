import {
  Blockfrost,
  fromText,
  Lucid,
  MintingPolicy,
  PolicyId,
  TxHash,
  Address,
  Unit,
  NFTMetadataDetails,
} from "https://deno.land/x/lucid/mod.ts";

// Define the metadata details for each NFT asset
const nftMetadata: NFTMetadataDetails[] = [
  {
    name: "NFT 1",
    description: "This is NFT 1",
    image: "ipfs://QmRzicpReutwCkM6aotuKjErFCUD213DpwPq6ByuzMJaua1",
  },
  {
    name: "NFT 2",
    description: "This is NFT 2",
    image: "ipfs://QmRzicpReutwCkM6aotuKjErFCUD213DpwPq6ByuzMJaua2",
  },
];

// Initialize the Lucid object with the Cardano network provider
const lucid = await Lucid.new(
  new Blockfrost(
    "https://cardano-preprod.blockfrost.io/api/v0", // Replace with the correct endpoint for your Cardano network
    "preprodUFORB61aetgYVPS7c1qGhven5shd9cjE" // Replace with your own Blockfrost API key
  ),
  "Preprod" // Replace with the correct Cardano network name
);

// Select a wallet from a secret seed
const secretSeed =
  "unhappy hammer slow nephew nominee sudden meat office wrist just alpha spirit roof design grace sad inquiry nose reopen dismiss diary leader come play"; // Replace with your own secret seed
lucid.selectWalletFromSeed(secretSeed);
const addr: Address = await lucid.wallet.address();
console.log(addr, "this is address");

// Define the minting policies for the NFT assets
const mintingPolicies: MintingPolicy[] = [];
const policyIds: PolicyId[] = [];

for (let i = 0; i < nftMetadata.length; i++) {
  const mintingPolicy: MintingPolicy = lucid.utils.nativeScriptFromJson({
    type: "all",
    scripts: [
      {
        type: "before",
        slot: lucid.utils.unixTimeToSlot(Date.now() + 1000000),
      },
    ],
  });

  mintingPolicies.push(mintingPolicy);
  policyIds.push(lucid.utils.mintingPolicyToId(mintingPolicy));
}

// Define the mint function to create each NFT asset with its respective metadata and policy ID
async function mintNFT(
  metadata: NFTMetadataDetails,
  policyId: PolicyId
): Promise<TxHash> {
  const assetName: string = `${metadata.name}#${policyId}`;

  const tx = await lucid
    .newTx()
    .mintAssets(assetName, metadata)
    .attachMintingPolicy(policyId)
    .complete();

  const signedTx = await tx.sign().complete();

  const txHash = await signedTx.submit();

  return txHash;
}

// Mint NFT assets
for (let i = 0; i < nftMetadata.length; i++) {
  const metadata = nftMetadata[i];
  const policyId = policyIds[i];
  const txHash = await mintNFT(metadata, policyId);
  console.log(`NFT ${i + 1} minted: ${txHash}`);
}
