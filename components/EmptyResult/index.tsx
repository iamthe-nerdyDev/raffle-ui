import React from "react";
import { UFOSvg } from "..";

const EmptyResult = ({ text }: { text?: string }) => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-center gap-9 py-16">
      <UFOSvg />
      <p className="text-2xl font-semibold">{text || "Nothing Found"}</p>
    </div>
  );
};

export default EmptyResult;
