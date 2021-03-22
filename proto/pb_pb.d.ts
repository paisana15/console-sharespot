// package: pb
// file: pb.proto

import * as jspb from "google-protobuf";
import * as google_protobuf_empty_pb from "google-protobuf/google/protobuf/empty_pb";

export class Account extends jspb.Message {
  getAmount(): number;
  setAmount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Account.AsObject;
  static toObject(includeInstance: boolean, msg: Account): Account.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Account, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Account;
  static deserializeBinaryFromReader(message: Account, reader: jspb.BinaryReader): Account;
}

export namespace Account {
  export type AsObject = {
    amount: number,
  }
}

export class PayoutReq extends jspb.Message {
  getAmount(): number;
  setAmount(value: number): void;

  getAddress(): string;
  setAddress(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PayoutReq.AsObject;
  static toObject(includeInstance: boolean, msg: PayoutReq): PayoutReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PayoutReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PayoutReq;
  static deserializeBinaryFromReader(message: PayoutReq, reader: jspb.BinaryReader): PayoutReq;
}

export namespace PayoutReq {
  export type AsObject = {
    amount: number,
    address: string,
  }
}

export class PayoutRes extends jspb.Message {
  getTransactionhash(): string;
  setTransactionhash(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PayoutRes.AsObject;
  static toObject(includeInstance: boolean, msg: PayoutRes): PayoutRes.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PayoutRes, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PayoutRes;
  static deserializeBinaryFromReader(message: PayoutRes, reader: jspb.BinaryReader): PayoutRes;
}

export namespace PayoutRes {
  export type AsObject = {
    transactionhash: string,
  }
}

