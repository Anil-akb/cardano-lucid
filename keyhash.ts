import { Lucid, Blockfrost } from "https://deno.land/x/lucid/mod.ts";

// Create a Lucid instance
const lucid = await Lucid.new(
  new Blockfrost(
    "https://cardano-preprod.blockfrost.io/api/v0",
    "preprodtyFN0EwaRtGhJEHaM8R0X5V29gXS78YQ"
  ),
  "Preprod"
);

// Define the address for which you want to find the key hash
const address =
  "addr_test1qrjznmajmzkz2p7a54xfyzwz59xa467gz9jpxj4tm8y22u2mxfgzt74dgyh5hf4s5wnhljkw7fm9zguqnz6x3r8w6q8snqm5tg"; // Replace with the actual address

// Get the address details and extract the key hash
const { paymentCredential } = lucid.utils.getAddressDetails(address);
const keyHash = paymentCredential?.hash;

console.log("Key Hash:", keyHash);
