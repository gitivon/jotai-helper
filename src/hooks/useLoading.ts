import { Atom, useAtomValue } from "jotai";
import { loadable } from "jotai/utils";

export const useLoading = <T>(baseAtom: Atom<T>) => {
  const loadingAtom = loadable(baseAtom);
  return useAtomValue(loadingAtom).state === 'loading'
}