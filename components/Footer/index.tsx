"use client";

import React from "react";
import { IconBrandX, IconBrandDiscord, IconMickey } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import RaffleContract from "@/utils/contract";
import { useWalletConnection } from "@/hook";
import Link from "next/link";

const Footer = () => {
  const { address } = useWalletConnection();
  const { data } = useQuery({
    queryKey: ["config"],
    queryFn: async () => {
      const contract = new RaffleContract(null);
      return await contract.getConfig();
    },
  });

  return (
    <>
      {address && data && data.admins.includes(address) ? (
        <Link
          href={"/censored"}
          className="fixed flex items-center justify-center bg-slate-900 z-10 h-14 w-14 shadow rounded-full right-4 bottom-8"
        >
          <IconMickey className="stroke-white" size={25} strokeWidth={1.5} />
        </Link>
      ) : null}

      <footer className="pb-5 px-5">
        <div className="container mx-auto">
          <div className="flex items-center justify-between border-[1px] border-orange-300 px-4 py-3 mb-5">
            <p className="font-regular">
              Copyright &copy; {new Date().getFullYear()}
            </p>

            <div className="flex flex-row items-center gap-2.5">
              <a
                href="#"
                target="_blank"
                className="bg-orange-200 w-9 h-9 flex flex-row items-center justify-center rounded-none"
              >
                <IconBrandX strokeWidth={1.7} size={19} />
              </a>

              <a
                href="#"
                target="_blank"
                className="bg-orange-200 w-9 h-9 flex flex-row items-center justify-center rounded-none"
              >
                <IconBrandDiscord strokeWidth={1.7} size={19} />
              </a>
            </div>
          </div>

          <p className="text-center mb-4">
            <a
              className="border-b-[1px] border-black pb-1 px-1"
              href="https://storyset.com/space"
            >
              Space illustrations by Storyset
            </a>
          </p>
        </div>
      </footer>
    </>
  );
};

export default Footer;
