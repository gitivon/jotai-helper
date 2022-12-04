import { Suspense } from "react";
import { Count, incAtom } from "./atoms";
import { ReloadBtn } from "./Refresh";
import { waiting } from "../atoms/waiting";
import { atom, useAtomValue } from "jotai";

const showWhenFive = atom((get) => {
  return get(incAtom, {
    unstable_promise: true,
  });
});

const Inner = () => {
  const showed = useAtomValue(showWhenFive);
  return <>{showed}</>;
};

export const Wait = () => {
  return (
    <>
      <Suspense fallback="waiting...">
        <Inner />
      </Suspense>
      <Count />
      <ReloadBtn />
    </>
  );
};
