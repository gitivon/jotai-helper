import { Getter } from "jotai";
import { atom, Atom } from "jotai";

/**
 * 赋予只读atom重新执行的能力
 */
export const refresh = <T>(readableAtom: Atom<T>) => {
  const refreshAtom = atom(0);
  return atom(
    (get) => {
      get(refreshAtom);
      return readableAtom.read(get);
    },
    (_get, set) => {
      set(refreshAtom, (i) => i + 1);
    }
  );
};

export const atomWithRefresh = <T>(fn: (get: Getter) => T) => {
  return refresh(atom(fn));
};
