import { useAtomValue, useSetAtom } from "jotai";
import { useState } from "react";
import { useCallback } from "react";
import { withSuspense } from "../utils/withSuspense";
import { incAtom } from "./atoms";

export const Refresh = withSuspense(() => {
  const count = useAtomValue(incAtom);
  return (
    <>
      count: {count}
      <ReloadBtn />
    </>
  );
});

export const ReloadBtn = () => {
  const refresh = useSetAtom(incAtom);
  return <button onClick={refresh}>reload incAtom</button>;
};
