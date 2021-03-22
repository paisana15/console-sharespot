// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('@grpc/grpc-js');
var pb_pb = require('./pb_pb.js');
var google_protobuf_empty_pb = require('google-protobuf/google/protobuf/empty_pb.js');

function serialize_google_protobuf_Empty(arg) {
  if (!(arg instanceof google_protobuf_empty_pb.Empty)) {
    throw new Error('Expected argument of type google.protobuf.Empty');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_google_protobuf_Empty(buffer_arg) {
  return google_protobuf_empty_pb.Empty.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_pb_Account(arg) {
  if (!(arg instanceof pb_pb.Account)) {
    throw new Error('Expected argument of type pb.Account');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_pb_Account(buffer_arg) {
  return pb_pb.Account.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_pb_PayoutReq(arg) {
  if (!(arg instanceof pb_pb.PayoutReq)) {
    throw new Error('Expected argument of type pb.PayoutReq');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_pb_PayoutReq(buffer_arg) {
  return pb_pb.PayoutReq.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_pb_PayoutRes(arg) {
  if (!(arg instanceof pb_pb.PayoutRes)) {
    throw new Error('Expected argument of type pb.PayoutRes');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_pb_PayoutRes(buffer_arg) {
  return pb_pb.PayoutRes.deserializeBinary(new Uint8Array(buffer_arg));
}


var WalletService = exports.WalletService = {
  accountGet: {
    path: '/pb.Wallet/AccountGet',
    requestStream: false,
    responseStream: false,
    requestType: google_protobuf_empty_pb.Empty,
    responseType: pb_pb.Account,
    requestSerialize: serialize_google_protobuf_Empty,
    requestDeserialize: deserialize_google_protobuf_Empty,
    responseSerialize: serialize_pb_Account,
    responseDeserialize: deserialize_pb_Account,
  },
  newPayout: {
    path: '/pb.Wallet/NewPayout',
    requestStream: false,
    responseStream: false,
    requestType: pb_pb.PayoutReq,
    responseType: pb_pb.PayoutRes,
    requestSerialize: serialize_pb_PayoutReq,
    requestDeserialize: deserialize_pb_PayoutReq,
    responseSerialize: serialize_pb_PayoutRes,
    responseDeserialize: deserialize_pb_PayoutRes,
  },
};

exports.WalletClient = grpc.makeGenericClientConstructor(WalletService);
