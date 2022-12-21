import { atom, Atom } from "jotai";
import { loadable } from "jotai/utils";

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
  const refreshAtom = atom(Math.random());
  const loadableBaseAtom = loadable(baseAtom);
  let lastRefresh: number | undefined;
  return atom(
    (get) => {
      const current = get(refreshAtom);
      const load = get(loadableBaseAtom);
      if (load.state !== "hasData") {
        return cached !== NULL ? cached : get(baseAtom);
      }
      if (current !== lastRefresh && lastRefresh) {
        lastRefresh = undefined;
        return cached !== NULL ? cached : get(baseAtom);
      }
      cached = load.data as T;
      lastRefresh = current;
      return cached;
    },
    (_get, set, val?: ClearAction | MutateAction<Awaited<T>>) => {
      const clear = () => {
        cached = initialValue ?? NULL;
        set(refreshAtom, Math.random());
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
          set(refreshAtom, Math.random());
          break;
      }
    }
  );
}
