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
import { IconX } from "@tabler/icons-react";
import { fromBech32 } from "@cosmjs/encoding";

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

  const validateAddr = (address: string): boolean => {
    try {
      const { prefix, data } = fromBech32(address);

      if (prefix !== "orai") return false;
      if (data.length !== 20) return false;

      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  const [isBtnLoading, setIsBtnLoading] = useState<boolean>(false);
  const [protocolAddress, setProtocolAddreess] = useState<string>(
    config.protocol_address
  );
  const [protocolPercentage, setProtocolPercentage] = useState<number>(
    (Number(config.protocol_percentage) * 100) / 1_000_000
  );
  const [isWLEnabled, setIsWLEnabled] = useState<boolean>(
    config.is_whitelist_enabled
  );
  const [wlAddrs, setWlAddres] = useState<string[]>(
    config.whitelisted_addresses || []
  );
  const [addr, setAddr] = useState("");

  const removeFromWl = (idx: number) => {
    setWlAddres(wlAddrs.filter((_, i) => i !== idx));
  };

  //@ts-expect-error
  const handleAddAddress = (e) => {
    e.preventDefault();

    if (!validateAddr(addr)) {
      toast("Invalid address", { type: "error" });
      return;
    }

    if (wlAddrs.includes(addr)) {
      toast("Address is already in whitelist", { type: "warning" });
      return;
    }

    setWlAddres([addr, ...wlAddrs]);
    setAddr("");
  };

  return !address || !config.admins.includes(address) ? null : (
    <>
      <h1 className="text-4xl font-bold mb-6">Censored</h1>

      <div className="w-full max-w-[50rem]">
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
            >
              {isBtnLoading ? <LoadingDiv /> : "Save"}
            </CustomButton>
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
                    String(percentage)
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
            >
              {isBtnLoading ? <LoadingDiv /> : "Save"}
            </CustomButton>
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
            >
              {isBtnLoading ? <LoadingDiv /> : "Save"}
            </CustomButton>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-2 md:gap-4 mb-8">
          <div className="w-full md:w-1/3">
            <h4 className="text-lg font-bold mb-0.5">WL Address/es</h4>
            <p>
              Only addresses specified can create raffles if WL check is turned
              on
            </p>
          </div>

          <div className="w-full md:w-2/3">
            <form
              className="w-full flex items-center gap-3 mb-4"
              onSubmit={handleAddAddress}
            >
              <input
                autoComplete="off"
                type="text"
                value={addr}
                onChange={(e) => setAddr(e.target.value)}
                name="wlAddr"
                placeholder="Enter address"
                className="w-full border-[1px] bg-transparent border-gray-400 outline-none p-2.5 mt-3"
              />

              <CustomButton
                isDisabled={isBtnLoading}
                handleClick={async () => {
                  if (isBtnLoading) return;
                  setIsBtnLoading(true);

                  try {
                    const contract = new RaffleContract(address);

                    const gasPrice = GasPrice.fromString("0.025orai");
                    const client =
                      await SigningCosmWasmClient.connectWithSigner(
                        env.RPC_URL,
                        getOfflineSigner(),
                        { gasPrice }
                      );

                    const res = await contract.updateWlAddresses(
                      client,
                      wlAddrs
                    );

                    console.log(res);
                    toast("Whitelist updated successfully", {
                      type: "success",
                    });
                  } catch (e) {
                    console.error(e);
                    toast("Unable to update Whitelist", {
                      type: "error",
                    });
                  } finally {
                    setIsBtnLoading(false);
                  }
                }}
                className="px-7 py-2.5"
              >
                {isBtnLoading ? <LoadingDiv /> : "Save"}
              </CustomButton>
            </form>

            {wlAddrs.reverse().map((addr, idx) => (
              <div
                className="flex items-center justify-between bg-orange-50 p-3 mb-2"
                key={`wl-adde-${idx}`}
              >
                <p className="text-ellipsis w-[85%] overflow-hidden">{addr}</p>
                <div
                  onClick={() => removeFromWl(idx)}
                  className="border-l border-gray-400 pl-3 cursor-pointer"
                >
                  <IconX size={18} strokeWidth={1.6} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default CensoredForm;
