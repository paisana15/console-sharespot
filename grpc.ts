import * as grpc from '@grpc/grpc-js';
import { Empty } from 'google-protobuf/google/protobuf/empty_pb';
import { WalletClient } from "./proto/pb_grpc_pb";
import { Account, PayoutRes, PayoutReq } from './proto/pb_pb'
import {Metadata} from "@grpc/grpc-js";

// creating client
const target = '139.59.164.172:8888'; // public Ip, we will change it for a local private address later
const client = new WalletClient(target, grpc.credentials.createInsecure());


const metadata = new Metadata()
metadata.add("auth", "token")

// call AccountGet RPC
client.accountGet(new Empty(), metadata, (err: grpc.ServiceError | null, account: Account) => {
    if (err) {
        throw err
    } else {
        console.log('Wallet Amount:', account.getAmount());
    }
})

// Create request
const payoutRequest = new PayoutReq()
payoutRequest.setAddress("bullish here")
payoutRequest.setAmount(1000000000000000)

// Call New
client.newPayout(payoutRequest, metadata, (err: grpc.ServiceError, payoutResponse: PayoutRes) => {
    if (err) {
        if (err.code === 13) {
            console.log("Wallet is locked, cannot proceed payout")
        } else {
            console.error(err)
        }
    } else {
        console.log('Success, transaction hash:', payoutResponse.getTransactionhash());
    }
})