import { useAtomValue } from "jotai";
import { useUpdateAtom } from "jotai/utils";
import { atomWithDeferred } from "../atomCreators/atomWithDeferred";
import { withSuspense } from "../utils/withSuspense";

const pAtom = atomWithDeferred<string>();

const Inner = withSuspense(() => {
  return <>{useAtomValue(pAtom)}</>;
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
