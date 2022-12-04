import type { WritableAtom } from "jotai";
import { useAtomCallback } from "jotai/utils";
import { useCallback } from "react";

export const useSetAtomAsync = <P, T, R extends void = void>(
  writableAtom: WritableAtom<P, T, R>
) => {
  return useAtomCallback(
    useCallback(
      (get, set, val: T) => {
        set(writableAtom, val);
        return get(writableAtom, {
          unstable_promise: true,
        }) as Awaited<P>;
      },
      [writableAtom]
    )
  );
};
