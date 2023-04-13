import React, { EventHandler, MouseEventHandler, useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";

interface ArrayInputProps {
  prefixName: string;
  children: (params: {
    name: string;
    index: number;
    prefixName: string;
  }) => React.ReactElement;
}

export function ArrayInput({ children, prefixName }: ArrayInputProps) {
  const [inputList, setInputList] = useState([
    children({
      name: `${prefixName}.${0}`,
      index: 0,
      prefixName,
    })
  ]);

  const handleAddInput: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault();
    setInputList(prev => [
      ...prev,
      children({
        name: `${prefixName}.${prev.length}`,
        index: prev.length,
        prefixName,
      })
    ]);
  };

  return (
    <>
      <div className="w-full space-y-2">
        {inputList}
      </div>

      <button
        className="w-full border border-gray-300 flex justify-center rounded-[4px] mt-1 mb-4 p-1 bg-slate-300"
        onClick={handleAddInput}
      >
        <AiOutlinePlus className="text-[16px] text-black" />
      </button>
    </>
  );
}
