import { atom } from "jotai";
import { useCallback } from "react";
import { useSetAtomAsync } from "../hooks/useSetAtomAsync";
import { Count, incAtom } from "./atoms";

console.log("UseSetAtomAsync.tsx:3", incAtom);

const testAtom = atom(0);

export const UseSetAtomAsync = () => {
  const refetch = useSetAtomAsync(testAtom);
  console.log("UseSetAtomAsync.tsx:5", refetch);
  return (
    <>
      <Count />
      <button
        onClick={async () => {
          console.log("UseSetAtomAsync.tsx:11", "refetch start");
          await refetch(2);
          console.log("UseSetAtomAsync.tsx:11", "refetch end");
        }}
      >
        点我异步inc
      </button>
    </>
  );
};
