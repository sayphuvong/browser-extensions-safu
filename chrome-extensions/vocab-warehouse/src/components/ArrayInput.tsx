import React, { useState } from "react";
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
  const [inputCount, setInputCount] = useState(1);

  return (
    <>
      <div className="w-full space-y-2">
        {[...Array(inputCount)].map((item, index) => (
          <React.Fragment key={index}>
            {children({
              name: `${prefixName}.${index}`,
              index,
              prefixName,
            })}
          </React.Fragment>
        ))}
      </div>

      <button
        className="w-full border border-gray-300 flex justify-center rounded-[4px] mt-1 mb-4 p-1"
        onClick={() => setInputCount((prev) => prev + 1)}
      >
        <AiOutlinePlus className="text-[24px] text-gray-400" />
      </button>
    </>
  );
}
