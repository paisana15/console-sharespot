const pb = require('./pb_pb');
const grpc = require('./pb_grpc_pb');
const grpcjs = require('@grpc/grpc-js');
const google_protobuf_empty_pb = require('google-protobuf/google/protobuf/empty_pb.js');

class WalletClient {
    token = ""
    constructor(target, token) {
        this.client = new grpc.WalletClient(target, grpcjs.credentials.createInsecure());
        this.token = token
    }

    getAccount(callback) {
        const metadata = new grpcjs.Metadata()
        metadata.add("auth", this.token)

        this.client.accountGet(new google_protobuf_empty_pb.Empty(), metadata, callback)
    }

    sendPayout(address, amount) {
        const payoutRequest = new pb.PayoutReq();
        payoutRequest.setAddress(address)
        payoutRequest.setAmount(amount)

        const metadata = new grpcjs.Metadata()
        metadata.add("auth", this.token)
        const client = this.client

        return new Promise(function(resolve, reject) {
            client.newPayout(payoutRequest, metadata, (err, payoutRes) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(payoutRes)
                }
            })
        })
    }

}

exports.WalletClient = WalletClient