import { atom, Atom } from "jotai";
import { loadable } from "jotai/utils";
import { atomWithRefresh } from "./refresh";

const NULL = Symbol();

export type ClearAction = {
  type: "clear";
};
export type MutateAction<T> = {
  type: "mutate";
  payload: T;
};

export function cache<T>(baseAtom: Atom<T>, initialValue?: Awaited<T>) {
  let cached: T | typeof NULL = initialValue ?? NULL;
  const refreshAtom = atomWithRefresh(() => {
    return Math.random();
  });
  const loadableBaseAtom = loadable(baseAtom);
  let lastRefresh: number | undefined;
  return atom(
    (get) => {
      const current = get(refreshAtom);
      const load = get(loadableBaseAtom);
      console.log("cache.ts:25", cached);
      if (load.state !== "hasData") {
        return cached !== NULL ? cached : get(baseAtom);
      }
      if (current !== lastRefresh && lastRefresh) {
        lastRefresh = undefined;
        return cached !== NULL ? cached : get(baseAtom);
      }
      console.log("cache.ts:33", lastRefresh, current);
      cached = load.data as T;
      lastRefresh = current;
      return cached;
    },
    (_get, set, val?: ClearAction | MutateAction<Awaited<T>>) => {
      const clear = () => {
        cached = initialValue ?? NULL;
        set(refreshAtom, undefined);
      };
      if (!val) {
        clear();
        return;
      }
      switch (val.type) {
        default:
        case "clear":
          clear();
          break;
        case "mutate":
          cached = val.payload;
          set(refreshAtom);
          break;
      }
    }
  );
}
