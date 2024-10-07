"use client";

import React, { useEffect, useState } from "react";
import { ArrayOfTicket } from "@/types/RaffleContract.types";
import { useWalletConnection } from "@/hook";
import { EmptyResult } from "..";
import Link from "next/link";
import { getAvatar, truncate } from "@/utils";
import { IconTrophy } from "@tabler/icons-react";
import { formatDistanceToNow } from "date-fns";

type RenderTicketsProps = {
  tickets: ArrayOfTicket;
  winning_ticket_id?: number;
};

const RenderTimestamp = ({ timestamp }: { timestamp: number }) => {
  const [text, setText] = useState<string>();

  useEffect(() => {
    setText(formatDistanceToNow(timestamp * 1000, { addSuffix: true }));
  }, [timestamp, formatDistanceToNow]);

  return <p>{text ? text : "--------"}</p>;
};

const RenderTickets = ({ tickets, winning_ticket_id }: RenderTicketsProps) => {
  const { address } = useWalletConnection();

  return (
    <div className="col-span-12 mt-6">
      <h2 className="text-2xl mb-3.5">Raffle Ticket/s ({tickets?.length})</h2>

      {tickets.length === 0 ? (
        <EmptyResult />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-orange-200">
              <tr>
                <th scope="col" className="px-6 py-4">
                  #
                </th>
                <th scope="col" className="px-6 py-4">
                  Bought By
                </th>
                <th scope="col" className="px-6 py-4">
                  Bought
                </th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((item, idx) => (
                <tr key={idx.toString()} className="hover:bg-orange-50">
                  <td className="px-6 py-4">{(idx + 1).toLocaleString()}</td>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap pr-10">
                    <Link
                      href={`/user/${item.owner}`}
                      className="flex items-center gap-2"
                    >
                      <img
                        src={getAvatar(item.owner)}
                        alt={item.owner}
                        className="h-10 w-10 flex rounded-full items-center justify-center bg-orange-200"
                        width={300}
                        height={300}
                      />

                      <div className="flex items-center gap-2">
                        <p>
                          {truncate(item.owner)}
                          {item.owner === address ? " (You)" : ""}
                        </p>

                        {idx + 1 === winning_ticket_id ? (
                          <IconTrophy
                            className="stroke-orange-800"
                            size={20}
                            strokeWidth={1.8}
                          />
                        ) : null}
                      </div>
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <RenderTimestamp timestamp={item.timestamp} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default RenderTickets;
