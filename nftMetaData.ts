import {
  Blockfrost,
  fromText,
  Lucid,
  MintingPolicy,
  PolicyId,
  Unit,
  NFTMetadataDetails,
} from "https://deno.land/x/lucid/mod.ts";

const secretSeed =
  "unhappy hammer slow nephew nominee sudden meat office wrist just alpha spirit roof design grace sad inquiry nose reopen dismiss diary leader come play";

// Define the metadata details
const metadata: NFTMetadataDetails = {
  name: "My NFT",
  description: "This is my NFT",
  image: "ipfs://QmRzicpReutwCkM6aotuKjErFCUD213DpwPq6ByuzMJaua",
};
let lucid: Lucid;
let policyId: PolicyId;
let mintingPolicy: MintingPolicy;

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
  });
export async function mintNFT(name: string) {
  const unit: Unit = policyId + fromText(name);
  const UNIT_VALUE = 2n;

  // const wallet = await lucid.wallet();
  const tx = await lucid
    .newTx()
    .mintAssets({ [unit]: UNIT_VALUE })
    .attachMintingPolicy(mintingPolicy)
    .addMetadata({ unit }, metadata)
    .complete();

  const signedTx = await tx.sign().complete();

  const txHash = await signedTx.submit();

  return { txHash, UNIT_VALUE };
}

const name = "MyNFT123";
const { txHash, UNIT_VALUE } = await mintNFT(name);
console.log(name, txHash, UNIT_VALUE);
