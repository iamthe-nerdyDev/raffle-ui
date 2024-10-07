"use client";

import React from "react";
import Select from "react-select";
import type { ActionMeta, GroupBase, OptionsOrGroups } from "react-select";

type ComboBoxProps = {
  isLoading?: boolean;
  defaultValue?: any;
  value?: any;
  className?: string;
  placeholder?: string;
  options?: OptionsOrGroups<any, GroupBase<any>>;
  onChange?: (newValue: any, actionMeta: ActionMeta<any>) => void;
};

const ComboBox = ({
  isLoading,
  onChange,
  options,
  defaultValue,
  className,
  value,
  placeholder,
}: ComboBoxProps) => {
  return (
    <Select
      className={className}
      value={value}
      styles={{
        control: (base) => ({ ...base, padding: "4px" }),
        option: (base) => ({ ...base, display: "flex", alignItems: "center" }),
        valueContainer: (base) => ({
          ...base,
          paddingTop: "5px",
          paddingBottom: "5px",
          paddingLeft: "5px",
        }),
      }}
      defaultValue={defaultValue}
      onChange={onChange}
      placeholder={placeholder}
      options={options}
      isLoading={isLoading}
      isSearchable={false}
    />
  );
};

export default ComboBox;
