import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Suspense, useState } from "react";
import { useCallback } from "react";
import { withSuspense } from "../utils/withSuspense";
import { incAtom, userAtom } from "./atoms";

export const Refresh = withSuspense(() => {
  const count = useAtomValue(incAtom);
  return (
    <>
      count: {count}
      <ReloadBtn />
      <Suspense fallback="loading...">
        <User />
      </Suspense>
    </>
  );
});

const User = () => {
  const [user, setUser] = useAtom(userAtom);
  return <>{JSON.stringify(user)}</>;
};

export const ReloadBtn = () => {
  const refresh = useSetAtom(incAtom);

  return <button onClick={refresh}>reload incAtom</button>;
};
