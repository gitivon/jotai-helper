import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { Suspense } from "react";
import { TransitionAction } from "../atoms/refresh";
import { incAtom, incLoadingAtom, userAtom } from "./atoms";

export const Refresh = () => {
  const [count, refresh] = useAtom(incAtom);
  const loading = useAtomValue(incLoadingAtom);
  console.log("Refresh.tsx:7", "render", count);
  return (
    <>
      <p>count: {count}</p>
      <p>loading: {JSON.stringify(loading)}</p>
      <ReloadBtn />
      <button
        onClick={() => {
          refresh({ type: "transition" });
        }}
      >
        silenceRefresh
      </button>
    </>
  );
};

const User = () => {
  const [user, setUser] = useAtom(userAtom);
  return <>{JSON.stringify(user)}</>;
};

export const ReloadBtn = (action: TransitionAction) => {
  const refresh = useSetAtom(incAtom);

  return <button onClick={() => refresh(action)}>reload incAtom</button>;
};
