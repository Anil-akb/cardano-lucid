import {
    Data,
    Lucid,
    Blockfrost,
    getAddressDetails,
    SpendingValidator,
    TxHash,
    Datum,
    UTxO,
    Address,
    AddressDetails,
} from "https://deno.land/x/lucid@0.9.1/mod.ts"


if (!String.prototype.normalize) {
    // Polyfill for String.prototype.normalize
    import("unorm").then((unorm) => {
      String.prototype.normalize = function (form) {
        return unorm.nfc(this);
      };
    });
  }
  



// Define the normalize function to fix the error
function normalize(str: string): string {
  return (str || "").normalize("NFKD");
}

// create a seed.ts file with your seed
import { secretSeed } from "./seed.ts"

// set blockfrost endpoint
const lucid = await Lucid.new(
  new Blockfrost(
    "https://cardano-preprod.blockfrost.io/api/v0",
    "preprodUFORB61aetgYVPS7c1qGhven5shd9cjE"
  ),
  "Preprod"
);

// load local stored seed as a wallet into lucid
lucid.selectWalletFromSeed(secretSeed);
const addr: Address = await lucid.wallet.address();
console.log(addr,"this is address");

// Define the vesting plutus script
const vestingScript: SpendingValidator = {
    type: "PlutusV2",
    script: "5907c95907c60100003232323232323232323232323232323322323232323222232325335333222350022253350021001101e3333573466e1cd55ce9baa0054800080648c98c8064cd5ce00d80c80b99191999ab9a3370e6aae754009200023355010301935742a00460326ae84d5d1280111931900d99ab9c01d01b019135573ca00226ea8010cccd5cd19b8735573aa0049000119910919800801801191919191919191919191919191999ab9a3370e6aae754031200023333333333332222222222221233333333333300100d00c00b00a00900800700600500400300233501501635742a01866a02a02c6ae85402ccd405405cd5d0a805199aa80cbae501835742a012666aa032eb94060d5d0a80419a80a8109aba150073335501902275a6ae854018c8c8c8cccd5cd19b8735573aa00490001199109198008018011919191999ab9a3370e6aae754009200023322123300100300233502c75a6ae854008c0b4d5d09aba2500223263202f33573806205e05a26aae7940044dd50009aba150023232323333573466e1cd55cea8012400046644246600200600466a058eb4d5d0a80118169aba135744a004464c6405e66ae700c40bc0b44d55cf280089baa001357426ae8940088c98c80accd5ce01681581489aab9e5001137540026ae854014cd4055d71aba150043335501901e200135742a006666aa032eb88004d5d0a80118101aba135744a004464c6404e66ae700a409c0944d5d1280089aba25001135744a00226ae8940044d5d1280089aba25001135744a00226ae8940044d5d1280089aba25001135573ca00226ea8004d5d0a80118081aba135744a004464c6403266ae7006c06405c40604c98c8060cd5ce24810350543500018135573ca00226ea800448c88c008dd6000990009aa80b111999aab9f0012500a233500930043574200460066ae880080548c8c8cccd5cd19b8735573aa004900011991091980080180118069aba150023005357426ae8940088c98c8054cd5ce00b80a80989aab9e5001137540024646464646666ae68cdc39aab9d5004480008cccc888848cccc00401401000c008c8c8c8cccd5cd19b8735573aa0049000119910919800801801180b1aba15002335010015357426ae8940088c98c8068cd5ce00e00d00c09aab9e5001137540026ae854010ccd54021d728039aba150033232323333573466e1d4005200423212223002004357426aae79400c8cccd5cd19b875002480088c84888c004010dd71aba135573ca00846666ae68cdc3a801a400042444006464c6403866ae700780700680640604d55cea80089baa00135742a00466a018eb8d5d09aba2500223263201633573803002c02826ae8940044d5d1280089aab9e500113754002266aa002eb9d6889119118011bab00132001355013223233335573e0044a010466a00e66aa012600c6aae754008c014d55cf280118021aba20030131357420022244004244244660020080062244246600200600424464646666ae68cdc3a800a40004642446004006600a6ae84d55cf280191999ab9a3370ea0049001109100091931900819ab9c01201000e00d135573aa00226ea80048c8c8cccd5cd19b875001480188c848888c010014c01cd5d09aab9e500323333573466e1d400920042321222230020053009357426aae7940108cccd5cd19b875003480088c848888c004014c01cd5d09aab9e500523333573466e1d40112000232122223003005375c6ae84d55cf280311931900819ab9c01201000e00d00c00b135573aa00226ea80048c8c8cccd5cd19b8735573aa004900011991091980080180118029aba15002375a6ae84d5d1280111931900619ab9c00e00c00a135573ca00226ea80048c8cccd5cd19b8735573aa002900011bae357426aae7940088c98c8028cd5ce00600500409baa001232323232323333573466e1d4005200c21222222200323333573466e1d4009200a21222222200423333573466e1d400d2008233221222222233001009008375c6ae854014dd69aba135744a00a46666ae68cdc3a8022400c4664424444444660040120106eb8d5d0a8039bae357426ae89401c8cccd5cd19b875005480108cc8848888888cc018024020c030d5d0a8049bae357426ae8940248cccd5cd19b875006480088c848888888c01c020c034d5d09aab9e500b23333573466e1d401d2000232122222223005008300e357426aae7940308c98c804ccd5ce00a80980880800780700680600589aab9d5004135573ca00626aae7940084d55cf280089baa0012323232323333573466e1d400520022333222122333001005004003375a6ae854010dd69aba15003375a6ae84d5d1280191999ab9a3370ea0049000119091180100198041aba135573ca00c464c6401866ae700380300280244d55cea80189aba25001135573ca00226ea80048c8c8cccd5cd19b875001480088c8488c00400cdd71aba135573ca00646666ae68cdc3a8012400046424460040066eb8d5d09aab9e500423263200933573801601200e00c26aae7540044dd500089119191999ab9a3370ea00290021091100091999ab9a3370ea00490011190911180180218031aba135573ca00846666ae68cdc3a801a400042444004464c6401466ae7003002802001c0184d55cea80089baa0012323333573466e1d40052002212200223333573466e1d40092000200723263200633573801000c00800626aae74dd5000a4c240022440029210350543100112323001001223300330020020011",
};
const vestingAddress: Address = lucid.utils.validatorToAddress(vestingScript);

// Create the vesting datum type
const VestingDatum = Data.Object({
    beneficiary: Data.String,
    deadline: Data.BigInt,
});
type VestingDatum = Data.Static<typeof VestingDatum>;

// Set the vesting deadline
const deadlineDate: Date = new Date("2023-03-19T00:00:00Z")
const deadlinePosIx = BigInt(deadlineDate.getTime());

// Set the vesting beneficiary to our own key.
const details: AddressDetails = getAddressDetails(addr);
const beneficiaryPKH: string = details.paymentCredential.hash

// Creating a datum with a beneficiary and deadline
const datum: VestingDatum = {
    beneficiary: beneficiaryPKH,
    deadline: deadlinePosIx,
};

// An asynchronous function that sends an amount of Lovelace to the script with the above datum.
async function vestFunds(amount: bigint): Promise<TxHash> {
    const dtm: Datum = Data.to<VestingDatum>(datum,VestingDatum);
    const tx = await lucid
      .newTx()
      .payToContract(vestingAddress, { inline: dtm }, { lovelace: amount })
      .complete();
    const signedTx = await tx.sign().complete();
    const txHash = await signedTx.submit();
    return txHash
}

async function claimVestedFunds(): Promise<TxHash> {
    const dtm: Datum = Data.to<VestingDatum>(datum,VestingDatum);
    const utxoAtScript: UTxO[] = await lucid.utxosAt(vestingAddress);
    const ourUTxO: UTxO[] = utxoAtScript.filter((utxo) => utxo.datum == dtm);
    
    if (ourUTxO && ourUTxO.length > 0) {
        const tx = await lucid
            .newTx()
            .collectFrom(ourUTxO, Data.void())
            .addSignerKey(beneficiaryPKH)
            .attachSpendingValidator(vestingScript)
            .validFrom(Date.now()-100000)
            .complete();

        const signedTx = await tx.sign().complete();
        const txHash = await signedTx.submit();
        return txHash
    }
    else return "No UTxO's found that can be claimed"
}
console.log("fund +++++++")
  console.log(await vestFunds(1000000n));
  console.log(Date.now(),"--current time----")
//   console.log(await claimVestedFunds());
  