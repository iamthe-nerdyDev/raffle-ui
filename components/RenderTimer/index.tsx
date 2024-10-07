"use client";

import { calcCountdown } from "@/utils";
import React, { useEffect, useState } from "react";

type RenderTimerProps = {
  time: number;
  hasEnded: boolean;
};

const RenderTimer = ({ time, hasEnded }: RenderTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: "0",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(calcCountdown(time)), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="border-[1px] border-orange-300 px-3.5 py-4 mb-5 flex flex-col md:flex-row md:items-center gap-3">
      {hasEnded ? (
        <div className="w-full">
          <h3 className="text-xl text-center">Raffle Has Ended</h3>
        </div>
      ) : (
        <>
          <div className="w-full md:w-1/2">
            <h3 className="text-xl">Raffle Ends In:</h3>
          </div>

          <div className="w-full md:w-1/2 flex items-center justify-between">
            <p className="font-bold">{timeLeft.days} days</p>
            <p>:</p>
            <p>{timeLeft.hours}</p>
            <p>:</p>
            <p>{timeLeft.minutes}</p>
            <p>:</p>
            <p>{timeLeft.seconds}</p>
          </div>
        </>
      )}
    </div>
  );
};

export default RenderTimer;
