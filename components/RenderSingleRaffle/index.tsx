"use client";

import React, { useState } from "react";
import { CustomButton, RenderTickets, RenderTimer } from "..";
import { ArrayOfTicket, Raffle } from "@/types/RaffleContract.types";
import { useWalletConnection } from "@/hook";
import { toast } from "react-toastify";
import { GasPrice } from "@cosmjs/stargate";
import { SigningCosmWasmClient } from "@cosmjs/cosmwasm-stargate";
import RaffleContract from "@/utils/contract";
import env from "@/utils/env";
import { NFTInfo, truncate } from "@/utils";
import { IconCoins, IconTrophy } from "@tabler/icons-react";
import Link from "next/link";

type EndorBuyTicketProps = {
  tickets: ArrayOfTicket;
  raffle: Raffle;
  nft: NFTInfo;
};

const EndorBuyTicket = ({ tickets, raffle, nft }: EndorBuyTicketProps) => {
  const [isBtnLoading, setIsBtnLoading] = useState<boolean>(false);
  const { address, getOfflineSigner } = useWalletConnection();
  const {
    raffle_id,
    raffle_end_time,
    total_tickets_bought,
    total_tickets_available_for_sale,
  } = raffle;

  const DISPLAY_END_BTN = raffle_end_time
    ? Date.now() >= raffle_end_time * 1000
    : total_tickets_available_for_sale
    ? total_tickets_bought >= total_tickets_available_for_sale
    : false;

  const progressWidth = raffle.total_tickets_available_for_sale
    ? (raffle.total_tickets_bought * 100) /
      raffle.total_tickets_available_for_sale
    : undefined;

  const endRaffle = async () => {
    if (isBtnLoading) return;
    if (!address) return toast("Connect wallet first", { type: "error" });

    try {
      setIsBtnLoading(true);

      const gasPrice = GasPrice.fromString("0.025orai");
      const client = await SigningCosmWasmClient.connectWithSigner(
        env.RPC_URL,
        getOfflineSigner(),
        { gasPrice }
      );

      const contract = new RaffleContract(address);
      const res = await contract.endRaffle(client, raffle_id);

      raffle.has_ended = true;
      toast("Raffle Ended successfully!", { type: "success" });
      console.log(res);
    } catch (e) {
      toast("Oops! Could not end raffle", { type: "error" });
      console.log(e);
    } finally {
      setIsBtnLoading(false);
    }
  };

  const buyTicket = async () => {
    if (isBtnLoading) return;
    if (!address) return toast("Connect wallet first", { type: "error" });

    const amount = Number(raffle.ticket_price);

    try {
      setIsBtnLoading(true);

      if (raffle.max_ticket_per_user) {
        const contract = new RaffleContract(null);
        const ticket_count = await contract.getUserTicketCount(
          raffle_id,
          address
        );

        const count = ticket_count?.count || 0;
        if (count >= raffle.max_ticket_per_user) {
          toast(
            `Oops! You are entitled to only ${raffle.max_ticket_per_user.toLocaleString()} ticket/s on this raffle`,
            { type: "error" }
          );

          return setIsBtnLoading(false);
        }
      }

      const gasPrice = GasPrice.fromString("0.025orai");
      const client = await SigningCosmWasmClient.connectWithSigner(
        env.RPC_URL,
        getOfflineSigner(),
        { gasPrice }
      );

      const contract = new RaffleContract(address);
      const res = await contract.buyTicket(client, raffle_id, String(amount));

      tickets.push({ raffle_id, owner: address, timestamp: Date.now() / 1000 });
      raffle.total_tickets_bought += 1;
      raffle.total_coins_collected =
        Number(raffle.total_coins_collected) + amount;

      if (
        raffle.total_tickets_available_for_sale &&
        raffle.total_tickets_bought === raffle.total_tickets_available_for_sale
      ) {
        raffle.has_ended = true;
      }

      toast("Ticket bought successfully!", { type: "success" });
      console.log(res);
    } catch (e) {
      toast("Oops! Could not buy ticket", { type: "error" });
      console.log(e);
    } finally {
      setIsBtnLoading(false);
    }
  };

  return (
    <>
      <div className="col-span-12 md:col-span-7 lg:col-span-6">
        <h1 className="text-4xl mb-1 font-bold">
          {nft.extension.title || nft.extension.name}
        </h1>

        <p className="text-lg mb-4">{nft.extension.description}</p>

        {raffle.raffle_end_time ? (
          <RenderTimer
            time={raffle.raffle_end_time * 1000}
            hasEnded={raffle.has_ended}
          />
        ) : null}

        {raffle.total_tickets_available_for_sale ? (
          <div className="border-[1px] border-orange-300 p-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-5">
            <div className="w-full md:w-1/2">
              <h4 className="uppercase font-bold text-xs mb-2">
                Tickets Bought So Far
              </h4>
              <p>
                A total of&nbsp;
                <strong className="border-b-[1px] border-solid border-black">
                  {Number(
                    raffle.total_tickets_available_for_sale
                  ).toLocaleString()}
                </strong>
                &nbsp;tickets was let out and&nbsp;
                <strong className="border-b-[1px] border-solid border-black">{`${progressWidth?.toFixed(
                  0
                )}%`}</strong>
                &nbsp;is sold out already
              </p>
            </div>

            <div className="w-full md:w-1/2">
              <div className="w-full h-4 rounded-full bg-white border-[1px] border-orange-300 p-0.5">
                <div
                  className="h-full rounded-full bg-orange-300"
                  style={{ width: `${progressWidth || 0}%` }}
                />
              </div>
            </div>
          </div>
        ) : null}

        <div className="flex items-center gap-3 mb-5">
          <div className="w-1/2 border-[1px] border-orange-300 bg-orange-50 px-4 py-5 flex flex-col items-center justify-center">
            <IconTrophy size={30} strokeWidth={1.5} />
            <p className="text-xs font-semibold uppercase opacity-80 my-2">
              Winner
            </p>

            {raffle.winner ? (
              <Link href={`/user/${raffle.winner}?tab=won`}>
                {truncate(raffle.winner)}
              </Link>
            ) : (
              "........"
            )}
          </div>

          <div className="w-1/2 border-[1px] border-orange-300 bg-orange-50 px-4 py-5 flex flex-col items-center justify-center">
            <IconCoins size={30} strokeWidth={1.5} />
            <p className="text-xs font-semibold uppercase opacity-80 my-2">
              Pot($ORAI)
            </p>
            {(
              Number(raffle.total_coins_collected) / 1_000_000
            ).toLocaleString()}
          </div>
        </div>

        {raffle.has_ended ? null : (
          <div className="flex items-center justify-between">
            <CustomButton
              className="px-7"
              handleClick={DISPLAY_END_BTN ? endRaffle : buyTicket}
            >
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
              ) : DISPLAY_END_BTN ? (
                "End Raffle"
              ) : (
                "Buy Ticket"
              )}
            </CustomButton>
          </div>
        )}
      </div>

      <RenderTickets
        tickets={tickets}
        winning_ticket_id={raffle.winner_ticket_id || undefined}
      />
    </>
  );
};

export default EndorBuyTicket;
