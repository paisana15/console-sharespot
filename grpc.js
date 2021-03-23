import { WalletClient } from 'proto';

// // creating client
const target = '139.59.164.172:8888'; // public Ip, we will change it for a local private address later
const client = new WalletClient(target);

// get account sample
client.getAccount((err, res) => {
    console.log("get Account result", err, res.getAmount())
})

// send payout sample
client.sendPayout("bulshit address", 9999999, (err, payoutResponse) => {
    if (err) {
        if (err.code === 13) {
            console.log("wallet is locked")
        } else {
            throw err
        }
    } else {
        console.log("send Payout result", payoutResponse.getTransactionhash())
    }
})