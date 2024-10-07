"use client";

import React from "react";
import { NFTInfo, getAvatar, truncate } from "@/utils";
import {
  IconChevronRight,
  IconClock,
  IconHourglassLow,
  IconTicket,
  IconTrophy,
} from "@tabler/icons-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Raffle } from "@/types/RaffleContract.types";

type Props = {
  raffle: Raffle & { nft: NFTInfo };
};

const RenderRaffle = ({ raffle }: Props) => {
  return (
    <Link href={`/raffle/${raffle.raffle_id}`}>
      <div className="border-[1px] border-orange-300 p-2.5">
        <div className="mb-3 relative">
          <div className="absolute left-3 top-3 flex flex-row flex-wrap pr-3 gap-2">
            {raffle.winner ? (
              <div className="flex items-center gap-x-1 bg-purple-100 border-[1px] border-purple-400 px-2 py-[7px] rounded-md pr-2.5 w-max">
                <IconTrophy size={18} strokeWidth={1.8} />
                <p className="text-sm font-semibold">
                  {truncate(raffle.winner)}
                </p>
              </div>
            ) : null}

            <div className="flex items-center gap-x-1 bg-blue-100 border-[1px] border-blue-400 px-2 py-[5px] rounded-md pr-2.5 w-max">
              <IconTicket size={18} strokeWidth={1.8} />
              <p className="text-[13px] font-semibold mt-[3px]">
                {raffle.total_tickets_bought.toLocaleString()}/
                {raffle.total_tickets_available_for_sale?.toLocaleString() ||
                  "∞"}
              </p>
            </div>

            {!raffle.has_ended && raffle.raffle_end_time ? (
              <div className="flex items-center gap-x-1 bg-red-100 border-[1px] border-red-400 px-2 py-[5px] rounded-md pr-2.5 w-max">
                <IconClock size={18} strokeWidth={1.8} />
                <p className="text-[13px] font-semibold mt-[3px]">
                  {Date.now() / 1000 > raffle.raffle_end_time
                    ? "Ended"
                    : `Ends in ${formatDistanceToNow(
                        raffle.raffle_end_time * 1000
                      )}`}
                </p>
              </div>
            ) : null}
          </div>

          <div className="absolute left-3 bottom-3 flex flex-row flex-wrap pr-3 gap-2">
            {!raffle.has_ended ? (
              <div className="flex items-center gap-x-1 bg-orange-100 border-[1px] border-orange-400 p-[7px] rounded-full w-max">
                <IconHourglassLow size={18} strokeWidth={2} />
              </div>
            ) : null}
          </div>

          <img
            className="w-full"
            src={raffle.nft.extension.media || raffle.nft.extension.image}
            alt={raffle.nft.extension.title || raffle.nft.extension.name}
            width={400}
            height={400}
          />
        </div>

        <div>
          <h3 className="text-xl font-bold mb-0.5">
            {raffle.nft.extension.title || raffle.nft.extension.name}
          </h3>

          <p className="text-sm text-gray-700">
            {raffle.nft.extension.description}
          </p>

          <div className="-mx-2.5 border-t-[1px] border-orange-300 px-2.5 py-3.5 pb-1.5 mt-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-x-1.5">
                <img
                  src={getAvatar(raffle.owner)}
                  alt={raffle.owner}
                  className="h-10 w-10 flex rounded-full items-center justify-center bg-orange-200"
                  width={300}
                  height={300}
                />

                <div>
                  <p className="font-semibold">{truncate(raffle.owner)}</p>
                  <p className="text-[10px] text-gray-800 font-regular uppercase opacity-60">
                    Owner
                  </p>
                </div>
              </div>

              <IconChevronRight size={20} strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RenderRaffle;
