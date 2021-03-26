import { WalletClient } from 'proto';

// // creating client
const target = '139.59.164.172:8888'; // public Ip, we will change it for a local private address later
const client = new WalletClient(target);

// get account sample
client.getAccount((err, res) => {
  console.log('get Account result', err, res.getAmount());
});

// synchronous mode
let payoutResponse  = await client.sendPayout('13ESLoXiie3eXoyitxryNQNamGAnJjKt2WkiB4gNq95knxAiGEp', 99999999999999999)
console.log("transaction hash", payoutResponse.getTransactionhash())

// or asynchonous fashion way
client.sendPayout('13ESLoXiie3eXoyitxryNQNamGAnJjKt2WkiB4gNq95knxAiGEp', 999999999999999).
then((payoutResponse) => {
   console.log("payout succeed, transaction hash:", payoutResponse.getTransactionhash())
}).
catch((err) => {
    if (err.code === 7) {
        console.log("wallet locked")
    } else if (err.code === 8) {
        console.log("balance too low")
    }
})
