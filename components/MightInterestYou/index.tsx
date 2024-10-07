"use client";

import React from "react";
import RaffleContract from "@/utils/contract";
import { useQuery } from "@tanstack/react-query";
import { RenderRaffle } from "..";
import { getNftInfo } from "@/utils";

const MightInterestYou = () => {
  const { isLoading, data } = useQuery({
    queryKey: ["might-interest-you"],
    queryFn: async () => {
      const contract = new RaffleContract(null);
      const raffles = (await contract.getRaffles(1, 12)) || [];

      const fns = raffles.map(async (raffle) => {
        const nftInfo = await getNftInfo(
          raffle.cw721_contract_addr,
          raffle.token_id
        );

        return { ...raffle, nft: nftInfo };
      });

      return await Promise.all(fns);
    },
  });

  return isLoading || !data || data.length === 0 ? null : (
    <div className="px-5 mb-5 bg-orange-50 py-14">
      <div className="container mx-auto">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 mb-2">
            <h2 className="text-3xl">Might Interest You</h2>
          </div>

          {data?.map((item, idx) => (
            <div
              className="col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3"
              key={`raffle-${idx}`}
            >
              <RenderRaffle raffle={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MightInterestYou;
