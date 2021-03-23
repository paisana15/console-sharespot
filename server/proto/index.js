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

    sendPayout(address, amount, callback) {
        const payoutRequest = new pb.PayoutReq();
        payoutRequest.setAddress(address)
        payoutRequest.setAmount(amount)

        const metadata = new grpcjs.Metadata()
        metadata.add("auth", this.token)

        this.client.newPayout(payoutRequest, metadata, callback)
    }

}

exports.WalletClient = WalletClient