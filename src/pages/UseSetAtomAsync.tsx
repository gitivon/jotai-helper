import { atom, useAtomValue } from "jotai";
import { useAtomCallback } from "jotai/utils";
import { useCallback } from "react";
import { useSetAtomAsync } from "../hooks/useSetAtomAsync";
import { withSuspense } from "../utils/withSuspense";
import {
  Count,
  incAtom,
  localUserAtom,
  localUserDetailAtom,
  userAtom,
} from "./atoms";

const User = withSuspense(() => {
  const user = useAtomValue(localUserDetailAtom);
  return <>{JSON.stringify(user)}</>;
});

export const UseSetAtomAsync = () => {
  const refetch = useSetAtomAsync(incAtom);
  const refresh = useAtomCallback(
    useCallback(async (get, set) => {
      set(localUserAtom);
      await get(localUserDetailAtom, {
        unstable_promise: true,
      });
      return true;
    }, [])
  );
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
      <User />
      <button
        onClick={async () => {
          console.log("UseSetAtomAsync.tsx:34", "start");
          await refresh();
          console.log("UseSetAtomAsync.tsx:36", "end");
        }}
      >
        点我刷新user
      </button>
    </>
  );
};
