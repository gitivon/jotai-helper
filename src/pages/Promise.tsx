import { useAtomValue } from "jotai";
import { useUpdateAtom } from "jotai/utils";
import { useState } from "react";
import { atomWithDeferred } from "../atomCreators/atomWithDeferred";
import { withSuspense } from "../utils/withSuspense";

const pAtom = atomWithDeferred<string>();

const Inner = withSuspense(() => {
  const [count, setCount] = useState(0);
  return (
    <>
      <p>count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>inc count</button>
      <p>pAtom: {useAtomValue(pAtom)}</p>
    </>
  );
}, "loading component...");

export const Promisable = () => {
  const dispatch = useUpdateAtom(pAtom);
  return (
    <>
      <Inner />
      <button
        onClick={() => {
          dispatch({ type: "resolve", payload: "Hello" });
        }}
      >
        resolve
      </button>
      <button
        onClick={() => {
          dispatch({ type: "reset" });
        }}
      >
        reset
      </button>
    </>
  );
};
