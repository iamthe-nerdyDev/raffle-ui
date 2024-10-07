"use client";

import React, { useEffect, useState } from "react";
import { Raffle } from "@/types/RaffleContract.types";
import { EmptyResult, RenderRaffle } from "..";
import { NFTInfo, populateNftData } from "@/utils";
import RaffleContract from "@/utils/contract";
import { useInView } from "react-intersection-observer";
import { uniqBy } from "lodash";

type HomeRaffleRenderProps = {
  tab?: string;
  raffles: (Raffle & { nft: NFTInfo })[];
};

const HomeRaffleRender = ({ tab, raffles }: HomeRaffleRenderProps) => {
  const { ref, inView } = useInView();
  const [data, setData] = useState<(Raffle & { nft: NFTInfo })[]>([]);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState<boolean>(false);

  useEffect(() => setHasNextPage(true), [tab]);
  useEffect(() => setData(raffles), [raffles]);

  const loadNextPageHelper = async () => {
    const startAfter = String(data[data.length - 1]?.raffle_id);
    const LIMIT = 6;

    let fn = async () => {
      const contract = new RaffleContract(null);
      const raffles = (await contract.getRaffles(LIMIT, startAfter)) || [];

      return populateNftData(raffles);
    };

    if (tab === "ongoing") {
      fn = async () => {
        const contract = new RaffleContract(null);
        const raffles =
          (await contract.getOngoingRaffles(LIMIT, startAfter)) || [];

        return populateNftData(raffles);
      };
    }

    if (tab === "ended") {
      fn = async () => {
        const contract = new RaffleContract(null);
        const raffles =
          (await contract.getEndedRaffles(LIMIT, startAfter)) || [];

        return populateNftData(raffles);
      };
    }

    return await fn();
  };

  const loadNextPage = async () => {
    setIsFetchingNextPage(true);
    const response = await loadNextPageHelper();

    if (response.length === 0) setHasNextPage(false);

    setData((prev) => uniqBy([...prev, ...response], "raffle_id"));
    setIsFetchingNextPage(false);
  };

  useEffect(() => {
    if (inView && hasNextPage) loadNextPage();
  }, [inView, hasNextPage]);

  const content = data.map((item, i) => (
    <div
      className="col-span-12 md:col-span-6 lg:col-span-4"
      ref={data.length == i + 1 ? ref : undefined}
      key={`raffle-${i}`}
    >
      <RenderRaffle raffle={item} />
    </div>
  ));

  return (
    <div className="col-span-12 md:col-span-8 lg:col-span-9">
      <div className="min-h-72">
        {data.length == 0 ? (
          <EmptyResult
            text={`No ${
              tab ? (tab === "ongoing" ? "ongoing" : "ended") : ""
            } raffle/s`}
          />
        ) : (
          <div className="grid grid-cols-12 gap-4">
            {content}

            {isFetchingNextPage ? (
              <div className="col-span-12">
                <div className="flex items-center justify-center py-5">
                  <span className="loader" />
                </div>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeRaffleRender;
