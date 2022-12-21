import { atom, Atom } from "jotai";
import { loadable, selectAtom } from "jotai/utils";

// 过渡更新
export type TransitionAction = {
  type?: "transition";
};

const NULL = Symbol();

/**
 * 赋予只读atom重新执行的能力
 */
export const refresh = <T>(readableAtom: Atom<PromiseLike<T>>) => {
  const refreshAtom = atom(0);
  const cacheAtom = atom<typeof NULL | T>(NULL);
  let cached: typeof NULL | T = NULL;

  const refreshableAtom = atom(
    (get) => {
      get(refreshAtom);
      const val = readableAtom.read(get) as Promise<T>;
      if (val instanceof Promise) {
        val
          .then((r) => {
            cached = r;
          })
          .catch((r) => {
            console.warn(r);
          });
      }
      return val;
    },
    (_get, set) => {
      set(refreshAtom, (c) => c + 1);
    }
  );

  const loadableAtom = loadable(refreshableAtom);

  const getAtom = atom((get) => {
    const cache = get(cacheAtom);
    if (cache !== NULL) {
      return cache;
    } else {
      return get(refreshableAtom);
    }
  });

  const setAtom = atom(
    null,
    async (get, set, action: TransitionAction | undefined) => {
      if (action?.type) {
        set(cacheAtom, cached);
      }
      set(refreshAtom, (c) => c + 1);
      await get(refreshableAtom, {
        unstable_promise: true,
      });
      set(cacheAtom, NULL);
    }
  );

  return atom((get) => {
    return {
      isLoading: get(selectAtom(loadableAtom, (i) => i.state === "loading")),
      data: get(getAtom),
    };
  }, setAtom.write);
};

// export const atomWithRefresh = <T>(fn: (get: Getter) => T) => {
//   return refresh(atom(fn));
// };
