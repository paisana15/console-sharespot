// GENERATED CODE -- DO NOT EDIT!

// package: pb
// file: pb.proto

import * as pb_pb from "./pb_pb";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";
import * as grpc from "@grpc/grpc-js";

interface IWalletService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
  accountGet: grpc.MethodDefinition<google_protobuf_empty_pb.Empty, pb_pb.Account>;
  newPayout: grpc.MethodDefinition<pb_pb.PayoutReq, pb_pb.PayoutRes>;
}

export const WalletService: IWalletService;

export interface IWalletServer extends grpc.UntypedServiceImplementation {
  accountGet: grpc.handleUnaryCall<google_protobuf_empty_pb.Empty, pb_pb.Account>;
  newPayout: grpc.handleUnaryCall<pb_pb.PayoutReq, pb_pb.PayoutRes>;
}

export class WalletClient extends grpc.Client {
  constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
  accountGet(argument: google_protobuf_empty_pb.Empty, callback: grpc.requestCallback<pb_pb.Account>): grpc.ClientUnaryCall;
  accountGet(argument: google_protobuf_empty_pb.Empty, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<pb_pb.Account>): grpc.ClientUnaryCall;
  accountGet(argument: google_protobuf_empty_pb.Empty, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<pb_pb.Account>): grpc.ClientUnaryCall;
  newPayout(argument: pb_pb.PayoutReq, callback: grpc.requestCallback<pb_pb.PayoutRes>): grpc.ClientUnaryCall;
  newPayout(argument: pb_pb.PayoutReq, metadataOrOptions: grpc.Metadata | grpc.CallOptions | null, callback: grpc.requestCallback<pb_pb.PayoutRes>): grpc.ClientUnaryCall;
  newPayout(argument: pb_pb.PayoutReq, metadata: grpc.Metadata | null, options: grpc.CallOptions | null, callback: grpc.requestCallback<pb_pb.PayoutRes>): grpc.ClientUnaryCall;
}
