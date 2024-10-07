"use client";

import React, { useState } from "react";
import { useWalletConnection } from "@/hook";
import { Config } from "@/types/RaffleContract.types";
import RaffleContract from "@/utils/contract";
import env from "@/utils/env";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import { GasPrice } from "@cosmjs/stargate";
import { toast } from "react-toastify";
import { CustomButton } from "..";

type CensoredFormProps = {
  config: Config;
};

const LoadingDiv = () => {
  return (
    <div className="flex items-center justify-center px-2.5 py-1">
      <span
        className="loader"
        style={{
          width: "18px",
          height: "18px",
          borderTopWidth: "1.5px",
          borderRightWidth: "1.5px",
        }}
      />
    </div>
  );
};

const CensoredForm = ({ config }: CensoredFormProps) => {
  const { address, getOfflineSigner } = useWalletConnection();

  const toNumber = (value: string) => {
    if (!value) return 0;

    const num = Number(value);
    if (isNaN(num)) return 0;

    return num;
  };

  const [isBtnLoading, setIsBtnLoading] = useState<boolean>(false);
  const [ticketPrice, setTicketPrice] = useState<number>(
    Number(config.ticket_price) / 1_000_000
  );
  const [protocolAddress, setProtocolAddreess] = useState<string>(
    config.protocol_address
  );
  const [protocolPercentage, setProtocolPercentage] = useState<number>(
    (Number(config.protocol_percentage) * 100) / 1_000_000
  );
  const [isWLEnabled, setIsWLEnabled] = useState<boolean>(
    config.is_whitelist_enabled
  );

  return !address || !config.admins.includes(address) ? null : (
    <>
      <h1 className="text-4xl font-bold mb-6">Censored</h1>

      <div className="w-full max-w-[50rem]">
        <div className="flex flex-col md:flex-row justify-between gap-2 md:gap-4 mb-8">
          <div className="w-full md:w-1/3">
            <h4 className="text-lg font-bold mb-0.5">Ticket Price ($orai)</h4>
            <p>How much should a raffle ticket cost</p>
          </div>

          <div className="w-full md:w-2/3 flex items-center gap-3">
            <input
              type="text"
              className="w-full border-[1px] bg-transparent border-gray-400 outline-none p-2.5 mt-3"
              value={String(ticketPrice)}
              onChange={(e) => setTicketPrice(toNumber(e.target.value))}
            />

            <CustomButton
              children={isBtnLoading ? <LoadingDiv /> : "Save"}
              isDisabled={isBtnLoading}
              handleClick={async () => {
                if (isBtnLoading) return;
                setIsBtnLoading(true);

                try {
                  const price = (ticketPrice || 0) * 1_000_000;
                  const contract = new RaffleContract(address);

                  const gasPrice = GasPrice.fromString("0.025orai");
                  const client = await SigningCosmWasmClient.connectWithSigner(
                    env.RPC_URL,
                    getOfflineSigner(),
                    { gasPrice }
                  );

                  console.log(price);

                  const res = await contract.updateTicketPrice(
                    client,
                    String(price) as any
                  );

                  console.log(res);
                  toast("Ticket price updated successfully", {
                    type: "success",
                  });
                } catch (e) {
                  console.error(e);
                  toast("Unable to update ticket price", { type: "error" });
                } finally {
                  setIsBtnLoading(false);
                }
              }}
              className="px-7 py-2.5"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-2 md:gap-4 mb-8">
          <div className="w-full md:w-1/3">
            <h4 className="text-lg font-bold mb-0.5">Protocol Address</h4>
            <p>Address where protocol fee should go to</p>
          </div>

          <div className="w-full md:w-2/3 flex items-center gap-3">
            <input
              type="text"
              placeholder="Enter protocol address"
              className="w-full border-[1px] bg-transparent border-gray-400 outline-none p-2.5 mt-3"
              value={protocolAddress}
              onChange={(e) => setProtocolAddreess(e.target.value)}
            />

            <CustomButton
              children={isBtnLoading ? <LoadingDiv /> : "Save"}
              isDisabled={isBtnLoading}
              handleClick={async () => {
                if (isBtnLoading) return;
                setIsBtnLoading(true);

                try {
                  const contract = new RaffleContract(address);

                  const gasPrice = GasPrice.fromString("0.025orai");
                  const client = await SigningCosmWasmClient.connectWithSigner(
                    env.RPC_URL,
                    getOfflineSigner(),
                    { gasPrice }
                  );

                  const res = await contract.updateProtocolAddress(
                    client,
                    protocolAddress
                  );

                  console.log(res);
                  toast("Protocol address updated successfully", {
                    type: "success",
                  });
                } catch (e) {
                  console.error(e);
                  toast("Unable to update protocol address", { type: "error" });
                } finally {
                  setIsBtnLoading(false);
                }
              }}
              className="px-7 py-2.5"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-2 md:gap-4 mb-8">
          <div className="w-full md:w-1/3">
            <h4 className="text-lg font-bold mb-0.5">
              Protocol Percent(0-100)
            </h4>
            <p>Pot percentage allocated to protocol</p>
          </div>

          <div className="w-full md:w-2/3 flex items-center gap-3">
            <input
              type="text"
              placeholder="Enter protocol address"
              className="w-full border-[1px] bg-transparent border-gray-400 outline-none p-2.5 mt-3"
              value={String(protocolPercentage)}
              onChange={(e) => setProtocolPercentage(toNumber(e.target.value))}
            />

            <CustomButton
              children={isBtnLoading ? <LoadingDiv /> : "Save"}
              isDisabled={isBtnLoading}
              handleClick={async () => {
                if (isBtnLoading) return;
                setIsBtnLoading(true);

                try {
                  const percentage = (protocolPercentage * 1_000_000) / 100;
                  const contract = new RaffleContract(address);

                  const gasPrice = GasPrice.fromString("0.025orai");
                  const client = await SigningCosmWasmClient.connectWithSigner(
                    env.RPC_URL,
                    getOfflineSigner(),
                    { gasPrice }
                  );

                  const res = await contract.updateProtocolPercent(
                    client,
                    String(percentage) as any
                  );

                  console.log(res);
                  toast("Protocol percentage updated successfully", {
                    type: "success",
                  });
                } catch (e) {
                  console.error(e);
                  toast("Unable to update protocol percentage", {
                    type: "error",
                  });
                } finally {
                  setIsBtnLoading(false);
                }
              }}
              className="px-7 py-2.5"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-2 md:gap-4 mb-8">
          <div className="w-full md:w-1/3">
            <h4 className="text-lg font-bold mb-0.5">Enable WL</h4>
            <p>Enable or Disable whitelist check when creating raffles</p>
          </div>

          <div className="w-full md:w-2/3 flex items-center gap-3 justify-end">
            <label className="switch">
              <input
                type="checkbox"
                defaultChecked={config.is_whitelist_enabled}
                onChange={(e) => setIsWLEnabled(e.target.checked)}
              />
              <span className="slider round"></span>
            </label>

            <CustomButton
              children={isBtnLoading ? <LoadingDiv /> : "Save"}
              isDisabled={isBtnLoading}
              handleClick={async () => {
                if (isBtnLoading) return;
                setIsBtnLoading(true);

                try {
                  const contract = new RaffleContract(address);

                  const gasPrice = GasPrice.fromString("0.025orai");
                  const client = await SigningCosmWasmClient.connectWithSigner(
                    env.RPC_URL,
                    getOfflineSigner(),
                    { gasPrice }
                  );

                  const fn = isWLEnabled
                    ? () => contract.enableWhitelist(client)
                    : () => contract.disableWhitelist(client);

                  const res = await fn();

                  console.log(res);
                  toast("Whitelist check updated successfully!", {
                    type: "success",
                  });
                } catch (e) {
                  console.log(e);
                  toast("Unable to update status", { type: "error" });
                } finally {
                  setIsBtnLoading(false);
                }
              }}
              className="px-7 py-2.5"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CensoredForm;
