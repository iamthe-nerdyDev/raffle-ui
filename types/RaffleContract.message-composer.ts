/**
* This file was automatically generated by @cosmwasm/ts-codegen@1.11.1.
* DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
* and run the @cosmwasm/ts-codegen generate command to regenerate this file.
*/

import { Coin } from "@cosmjs/amino";
import { MsgExecuteContractEncodeObject } from "@cosmjs/cosmwasm-stargate";
import { MsgExecuteContract } from "cosmjs-types/cosmwasm/wasm/v1/tx";
import { toUtf8 } from "@cosmjs/encoding";
import { InstantiateMsg, ExecuteMsg, Binary, CustomCw721ReceiveMsg, QueryMsg, Addr, Config, ArrayOfRaffle, Raffle, ArrayOfTicket, Ticket, UserTicketCountResponse } from "./RaffleContract.types";
export interface RaffleContractMsg {
  contractAddress: string;
  sender: string;
  receiveNft: ({
    edition,
    msg,
    sender,
    tokenId
  }: {
    edition?: string;
    msg: Binary;
    sender: string;
    tokenId: string;
  }, _funds?: Coin[]) => MsgExecuteContractEncodeObject;
  buyTicket: ({
    raffleId
  }: {
    raffleId: number;
  }, _funds?: Coin[]) => MsgExecuteContractEncodeObject;
  endRaffle: ({
    raffleId
  }: {
    raffleId: number;
  }, _funds?: Coin[]) => MsgExecuteContractEncodeObject;
  updateWhitelistedAddresses: ({
    addresses
  }: {
    addresses: string[];
  }, _funds?: Coin[]) => MsgExecuteContractEncodeObject;
  updateTicketPrice: ({
    price
  }: {
    price: number;
  }, _funds?: Coin[]) => MsgExecuteContractEncodeObject;
  updateProtocolAddress: ({
    address
  }: {
    address: string;
  }, _funds?: Coin[]) => MsgExecuteContractEncodeObject;
  updateProtocolPercentagee: ({
    percentage
  }: {
    percentage: number;
  }, _funds?: Coin[]) => MsgExecuteContractEncodeObject;
  enableWhitelist: (_funds?: Coin[]) => MsgExecuteContractEncodeObject;
  disableWhitelist: (_funds?: Coin[]) => MsgExecuteContractEncodeObject;
}
export class RaffleContractMsgComposer implements RaffleContractMsg {
  sender: string;
  contractAddress: string;
  constructor(sender: string, contractAddress: string) {
    this.sender = sender;
    this.contractAddress = contractAddress;
    this.receiveNft = this.receiveNft.bind(this);
    this.buyTicket = this.buyTicket.bind(this);
    this.endRaffle = this.endRaffle.bind(this);
    this.updateWhitelistedAddresses = this.updateWhitelistedAddresses.bind(this);
    this.updateTicketPrice = this.updateTicketPrice.bind(this);
    this.updateProtocolAddress = this.updateProtocolAddress.bind(this);
    this.updateProtocolPercentagee = this.updateProtocolPercentagee.bind(this);
    this.enableWhitelist = this.enableWhitelist.bind(this);
    this.disableWhitelist = this.disableWhitelist.bind(this);
  }
  receiveNft = ({
    edition,
    msg,
    sender,
    tokenId
  }: {
    edition?: string;
    msg: Binary;
    sender: string;
    tokenId: string;
  }, _funds?: Coin[]): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify({
          receive_nft: {
            edition,
            msg,
            sender,
            token_id: tokenId
          }
        })),
        funds: _funds
      })
    };
  };
  buyTicket = ({
    raffleId
  }: {
    raffleId: number;
  }, _funds?: Coin[]): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify({
          buy_ticket: {
            raffle_id: raffleId
          }
        })),
        funds: _funds
      })
    };
  };
  endRaffle = ({
    raffleId
  }: {
    raffleId: number;
  }, _funds?: Coin[]): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify({
          end_raffle: {
            raffle_id: raffleId
          }
        })),
        funds: _funds
      })
    };
  };
  updateWhitelistedAddresses = ({
    addresses
  }: {
    addresses: string[];
  }, _funds?: Coin[]): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify({
          update_whitelisted_addresses: {
            addresses
          }
        })),
        funds: _funds
      })
    };
  };
  updateTicketPrice = ({
    price
  }: {
    price: number;
  }, _funds?: Coin[]): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify({
          update_ticket_price: {
            price
          }
        })),
        funds: _funds
      })
    };
  };
  updateProtocolAddress = ({
    address
  }: {
    address: string;
  }, _funds?: Coin[]): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify({
          update_protocol_address: {
            address
          }
        })),
        funds: _funds
      })
    };
  };
  updateProtocolPercentagee = ({
    percentage
  }: {
    percentage: number;
  }, _funds?: Coin[]): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify({
          update_protocol_percentagee: {
            percentage
          }
        })),
        funds: _funds
      })
    };
  };
  enableWhitelist = (_funds?: Coin[]): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify({
          enable_whitelist: {}
        })),
        funds: _funds
      })
    };
  };
  disableWhitelist = (_funds?: Coin[]): MsgExecuteContractEncodeObject => {
    return {
      typeUrl: "/cosmwasm.wasm.v1.MsgExecuteContract",
      value: MsgExecuteContract.fromPartial({
        sender: this.sender,
        contract: this.contractAddress,
        msg: toUtf8(JSON.stringify({
          disable_whitelist: {}
        })),
        funds: _funds
      })
    };
  };
}