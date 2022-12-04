import { atom } from "jotai";
import { useCallback } from "react";
import { useSetAtomAsync } from "../hooks/useSetAtomAsync";
import { Count, incAtom } from "./atoms";

export const UseSetAtomAsync = () => {
  const refetch = useSetAtomAsync(incAtom);
  return (
    <>
      <Count />
      <button
        onClick={async () => {
          console.log("UseSetAtomAsync.tsx:11", "refetch start");
          const newCount = await refetch();
          console.log("UseSetAtomAsync.tsx:11", "refetch end", newCount);
        }}
      >
        点我异步inc
      </button>
    </>
  );
};
