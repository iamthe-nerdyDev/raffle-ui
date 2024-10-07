"use client";

import React from "react";
import { ConnectBtn } from "..";
import useWalletConnection from "@/hook/useWalletConnection";
import Link from "next/link";
import { getAvatar } from "@/utils";
import env from "@/utils/env";

const Navbar = () => {
  const { address } = useWalletConnection();

  return (
    <>
      {env.NETWORK == "testnet" ? (
        <div className="bg-red-700 py-4 flex items-center justify-center gap-1.5">
          <p className="text-white">
            Heads up! You are on&nbsp;
            <strong className="border p-1.5 border-white text-white">
              Testnet
            </strong>
          </p>
        </div>
      ) : null}

      <div className="bg-orange-100 px-5 py-4 mb-1">
        <div className="container mx-auto">
          <div className="flex flex-row items-center justify-between">
            <Link href={"/"}>
              <h1 className=" flex items-end">
                <span className="text-xl font-extrabold leading-[10px]">
                  RugLeopoords
                </span>
                <span className="w-1.5 h-1.5 inline-block bg-orange-500 ml-0.5 rounded-full" />
              </h1>
            </Link>

            <div className="flex items-center gap-x-6">
              <ConnectBtn />

              {address ? (
                <Link href={`/user/${address}`}>
                  <img
                    src={getAvatar(address)}
                    alt={address}
                    className="h-11 w-11 flex rounded-full items-center justify-center bg-orange-200"
                    width={300}
                    height={300}
                  />
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
