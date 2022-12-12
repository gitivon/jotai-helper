import { atom, useAtomValue } from "jotai";
import { loadable } from "jotai/utils";
import { FC, Suspense } from "react";
import { atomWithDeferred } from "../atomCreators/atomWithDeferred";
import { Deferred } from "../atoms/waiting";
import { Count, incAtom } from "./atoms";
import { ReloadBtn } from "./Refresh";

let dfd: Deferred<void>;

const showedAtom = atom((get) => {
  const inc = get(incAtom);
  console.log("Wait.tsx:20", inc);
  if (inc <= 1) {
    dfd = new Deferred();
    throw dfd.promise;
  }
  dfd.resolve();
  return inc;
});

const Inner: FC = () => {
  const showed = useAtomValue(showedAtom);
  return <div>showed: {JSON.stringify(showed)}</div>;
};

const l = loadable(incAtom);

export const Wait = () => {
  useAtomValue(l);
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
