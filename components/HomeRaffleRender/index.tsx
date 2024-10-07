"use client";

import { useGetRaffles } from "@/hook";
import { Raffle } from "@/types/RaffleContract.types";
import React from "react";
import { uniqBy } from "lodash";
import { EmptyResult, RenderRaffle } from "..";
import { NFTInfo } from "@/utils";

type HomeRaffleRenderProps = {
  tab?: string;
  raffles: (Raffle & { nft: NFTInfo })[];
};

const HomeRaffleRender = ({ tab, raffles }: HomeRaffleRenderProps) => {
  const { data, isFetchingNextPage, ref } = useGetRaffles(tab);

  let DATA = [...raffles];
  if (data) DATA = [...DATA, ...data.pages.flatMap((value) => [...value])];
  DATA = uniqBy(DATA, "raffle_id");

  const content = DATA.map((item, i) => (
    <div
      ref={DATA.length == i + 1 ? ref : undefined}
      className="col-span-12 md:col-span-6 lg:col-span-4"
      key={`raffle-${i}`}
    >
      <RenderRaffle raffle={item} />
    </div>
  ));

  return (
    <div className="col-span-12 md:col-span-8 lg:col-span-9">
      <div className="min-h-72">
        {DATA.length == 0 ? (
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
