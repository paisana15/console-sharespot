import { WalletClient } from 'proto';

// // creating client
const target = '139.59.164.172:8888'; // public Ip, we will change it for a local private address later
const client = new WalletClient(target);

// get account sample
client.getAccount((err, res) => {
    console.log('get Account result', err, res.getAmount());
});

// send payout sample
client.sendPayout(
    '13ESLoXiie3eXoyitxryNQNamGAnJjKt2WkiB4gNq95knxAiGEp',
    9999999999999,
    (err, payoutResponse) => {
        if (err) {
            if (err.code === 7) {
                console.log('wallet is locked');
            } else if (err.code === 8) {
                console.log('low balance', err.details);
            } else {
                throw err;
            }
        } else {
            console.log('send Payout result', payoutResponse.getTransactionhash());
        }
    }
);
