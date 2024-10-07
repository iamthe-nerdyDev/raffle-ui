import React from "react";

type Props = {
  children: React.ReactNode;
  isDisabled?: boolean;
  handleClick?: () => void;
  className?: string;
};

export default function CustomButton({
  children,
  isDisabled,
  className,
  handleClick,
}: Props) {
  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isDisabled}
      className={`relative custom-btn bg-orange-300 text-black font-medium px-5 py-3 before:border-orange-300 before:border-[2px] before:absolute before:w-full before:h-full before:-bottom-2 before:-right-2 before:transition-all before:hover:-bottom-[10px] before:hover:-right-[10px] ${className}`}
    >
      {children}
    </button>
  );
}
