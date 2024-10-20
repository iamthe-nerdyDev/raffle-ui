"use client";

import React, { useState } from "react";
import { ComboBox, CustomButton } from "..";
import { useQuery } from "@tanstack/react-query";
import { getUserNfts } from "@/utils";
import { useWalletConnection } from "@/hook";
import RaffleContract from "@/utils/contract";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import env from "@/utils/env";
import { GasPrice } from "@cosmjs/stargate";
import { toast } from "react-toastify";
import { Config } from "@/types/RaffleContract.types";

type CreateRaffleRenderProps = {
  config?: Config;
  collections: { name: string; symbol: string; ca: string }[];
};

const CreateRaffleRender = ({
  collections,
  config,
}: CreateRaffleRenderProps) => {
  const { address, getOfflineSigner } = useWalletConnection();
  const [isBtnLoading, setIsBtnLoading] = useState<boolean>(false);
  const [collection, setCollection] = useState<string | null>(null);
  const [tokenId, setTokenId] = useState<string | null>(null);
  const [ticketPrice, setTicketPrice] = useState("0.5");
  const [maxTicketsPerUser, setMaxTicketsPerUser] = useState<number>();
  const [raffleEndTime, setRaffleEndTime] = useState<number>();
  const [totalTicketsForSale, setTotalTicketsForSale] = useState<number>();

  const createRaffle = async () => {
    if (isBtnLoading || !config || !ticketPrice) return;
    if (!address) return toast("Connect wallet first", { type: "error" });

    if (
      config.is_whitelist_enabled &&
      config.whitelisted_addresses &&
      !config.whitelisted_addresses.includes(address)
    ) {
      return toast("Address not whitelisted", { type: "error" });
    }

    if (!collection) {
      return toast("Choose an NFT collcetion", { type: "error" });
    }
    if (!tokenId) return toast("Choose an NFT", { type: "error" });

    try {
      setIsBtnLoading(true);

      const gasPrice = GasPrice.fromString("0.025orai");
      const client = await SigningCosmWasmClient.connectWithSigner(
        env.RPC_URL,
        getOfflineSigner(),
        {
          gasPrice,
        }
      );

      const contract = new RaffleContract(address);
      const res = await contract.createRaffle(
        client,
        collection,
        tokenId,
        address,
        {
          ticket_price: Number(ticketPrice) * 1_000_000,
          max_ticket_per_user: maxTicketsPerUser || null,
          raffle_end_time: raffleEndTime || null,
          total_tickets_available_for_sale: totalTicketsForSale || null,
        }
      );

      toast("Raffle Created successfully!", { type: "success" });
      setCollection(null);
      setTokenId(null);
      setMaxTicketsPerUser(undefined);
      setRaffleEndTime(undefined);
      setTotalTicketsForSale(undefined);

      console.log(res);
    } catch (e) {
      toast("Oops! Could not create raffle", { type: "error" });
      console.log(e);
    } finally {
      setIsBtnLoading(false);
    }
  };

  const { isLoading, data } = useQuery({
    queryKey: ["user-nfts", collection, address],
    queryFn: async () => {
      if (!collection || !address) return [];
      return await getUserNfts(collection, address);
    },
  });

  return (
    <>
      <div className="mb-5 border-[1px] border-orange-300 px-3.5 py-4">
        <p className="mb-1.5 font-semibold text-gray-800">NFT Collection</p>
        <ComboBox
          defaultValue={collection}
          onChange={(newValue) => setCollection(newValue.value)}
          options={collections.map((collection) => ({
            value: collection.ca,
            label: collection.name,
          }))}
          placeholder="Select NFT Collection"
        />
      </div>

      <div className="mb-5 border-[1px] border-orange-300 px-3.5 py-4">
        <p className="mb-1.5 font-semibold text-gray-800">Choose NFT</p>
        <ComboBox
          defaultValue={tokenId}
          onChange={(newValue) => setTokenId(newValue.value)}
          options={data?.map((nft) => ({
            value: nft.token_id,
            label: (
              <div style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={nft.extension.media || nft.extension.image}
                  alt={nft.extension.title || nft.extension.name}
                  className="mr-3 w-16 h-16"
                />

                <div>
                  <h4 className="text-lg font-semibold">
                    {nft.extension.title || nft.extension.name}
                  </h4>

                  <p>{nft.extension.description}</p>
                </div>
              </div>
            ),
          }))}
          placeholder="Select NFT"
          isLoading={isLoading}
        />
      </div>

      <div className="mb-5 border-[1px] border-orange-300 px-3.5 py-4">
        <p className="mb-1.5 font-semibold text-gray-800">
          Ticket Price (in $ORAI)
        </p>

        <input
          type="number"
          className="w-full bg-white border-[1px] bg-transparent border-gray-400 outline-none p-2.5 mt-3"
          placeholder="e.g. 1"
          value={ticketPrice}
          onChange={(e) => setTicketPrice(e.target.value)}
        />
      </div>

      <div className="mb-7 border-[1px] border-orange-300 px-3.5 py-4">
        <p className="mb-6 font-semibold text-gray-800">
          Advanced Options (Optional)
        </p>

        <div className="mb-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h5 className="text-xs uppercase font-bold mb-1">
                Max Tickets Per User
              </h5>
              <p className="text-sm opacity-80">
                Limits the number a ticket a user can buy for a raffle
              </p>
            </div>

            <div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={typeof maxTicketsPerUser !== "undefined"}
                  onChange={(e) =>
                    setMaxTicketsPerUser(e.target.checked ? 10 : undefined)
                  }
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>

          {typeof maxTicketsPerUser === "undefined" ? null : (
            <input
              type="number"
              className="w-full border-[1px] bg-transparent border-gray-400 outline-none p-2.5 mt-3"
              value={maxTicketsPerUser}
              onChange={(e) => setMaxTicketsPerUser(Number(e.target.value))}
            />
          )}
        </div>

        <div className="mb-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h5 className="text-xs uppercase font-bold mb-1">
                Raffles Ends at
              </h5>
              <p className="text-sm opacity-80">
                Specifies a time the user wants the raffle to end irrespective
                of the total tickets available for sale
              </p>
            </div>

            <div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={typeof raffleEndTime !== "undefined"}
                  onChange={(e) =>
                    setRaffleEndTime(
                      e.target.checked
                        ? Date.now() / 1000 + 24 * 60 * 60
                        : undefined
                    )
                  }
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>

          {typeof raffleEndTime === "undefined" ? null : (
            <input
              type="datetime-local"
              className="w-full border-[1px] bg-transparent border-gray-400 outline-none p-2.5 mt-3"
              value={new Date(raffleEndTime * 1000).toISOString().slice(0, 16)}
              onChange={(e) =>
                e.target.value
                  ? setRaffleEndTime(new Date(e.target.value).getTime() / 1000)
                  : setRaffleEndTime(undefined)
              }
            />
          )}
        </div>

        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h5 className="text-xs uppercase font-bold mb-1">
                Total Tickets Available For Sale
              </h5>
              <p className="text-sm opacity-80">
                Once the total tickets available for sale hits, the raffle will
                be ended
              </p>
            </div>

            <div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={typeof totalTicketsForSale !== "undefined"}
                  onChange={(e) =>
                    setTotalTicketsForSale(e.target.checked ? 100 : undefined)
                  }
                />
                <span className="slider round"></span>
              </label>
            </div>
          </div>

          {typeof totalTicketsForSale === "undefined" ? null : (
            <input
              type="number"
              className="w-full border-[1px] bg-transparent border-gray-400 outline-none p-2.5 mt-3"
              value={totalTicketsForSale}
              onChange={(e) => setTotalTicketsForSale(Number(e.target.value))}
            />
          )}
        </div>
      </div>

      <CustomButton handleClick={createRaffle} isDisabled={isBtnLoading}>
        {isBtnLoading ? (
          <div className="flex items-center justify-center px-3 py-1">
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
        ) : (
          <p className="px-4">Create</p>
        )}
      </CustomButton>
    </>
  );
};

export default CreateRaffleRender;
