"use client";

import { useWalletConnection } from "@/hook";
import { Raffle } from "@/types/RaffleContract.types";
import React, { useEffect, useState } from "react";
import { EmptyResult, RenderRaffle } from "..";
import Link from "next/link";
import { NFTInfo, populateNftData } from "@/utils";
import RaffleContract from "@/utils/contract";
import { useInView } from "react-intersection-observer";
import { uniqBy } from "lodash";

type UserRafflesRenderProps = {
  userAddr: string;
  tab?: string;
  raffles: (Raffle & { nft: NFTInfo })[];
};

const UserRafflesRender = ({
  userAddr,
  tab,
  raffles,
}: UserRafflesRenderProps) => {
  const { ref, inView } = useInView();
  const [data, setData] = useState<(Raffle & { nft: NFTInfo })[]>([]);
  const [hasNextPage, setHasNextPage] = useState<boolean>(true);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState<boolean>(false);
  const { address } = useWalletConnection();

  useEffect(() => setHasNextPage(true), [tab]);
  useEffect(() => setData(raffles), [raffles]);

  const loadNextPageHelper = async () => {
    const startAfter = String(data[data.length - 1]?.raffle_id);
    const LIMIT = 6;

    let fn = async () => {
      const contract = new RaffleContract(null);
      const raffles =
        (await contract.getUserRaffles(userAddr, LIMIT, startAfter)) || [];

      return populateNftData(raffles);
    };

    if (tab === "won") {
      fn = async () => {
        const contract = new RaffleContract(null);
        const raffles = await contract.getRafflesWonByUser(
          userAddr,
          LIMIT,
          startAfter
        );

        return populateNftData(raffles || []);
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

  const tabs = [
    { title: "Created Raffles" },
    { title: "Won Raffles", key: "won" },
  ];

  const content = data.map((item, i) => (
    <div
      ref={data.length == i + 1 ? ref : undefined}
      className="col-span-12 md:col-span-6 lg:col-span-4"
      key={`raffle-${i}`}
    >
      <RenderRaffle raffle={item} />
    </div>
  ));

  return (
    <div className="px-5 w-full mb-8">
      <div className="container mx-auto w-full">
        <div className="flex flex-col md:flex-row-reverse gap-6 w-full">
          <div className="w-full md:w-1/3 lg:w-1/4">
            <div className="flex flex-col gap-y-1.5 sticky top-5">
              {tabs.map((item, idx) => (
                <Link
                  href={item.key ? `?tab=${item.key}` : `/user/${userAddr}`}
                  key={`tab-${idx}`}
                  className={`w-full  ${
                    item.key === tab
                      ? "bg-orange-200 border-orange-400"
                      : "bg-transparent border-transparent hover:bg-orange-200"
                  } border-[1px] py-3.5 rounded-md cursor-pointer transition-all`}
                >
                  <p className="text-sm text-center">{item.title}</p>
                </Link>
              ))}

              {address === userAddr ? (
                <Link
                  href={"/create-raffle"}
                  className="w-full bg-transparent border-transparent hover:bg-orange-200 border-[1px] py-3.5 rounded-md cursor-pointer transition-all"
                >
                  <p className="text-sm text-center">Create new Raffle +</p>
                </Link>
              ) : null}
            </div>
          </div>

          <div className="w-full md:w-2/3 lg:w-3/4">
            <div className="min-h-72">
              {data.length == 0 ? (
                <EmptyResult />
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
        </div>
      </div>
    </div>
  );
};

export default UserRafflesRender;
