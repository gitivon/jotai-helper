import { atom } from "jotai";
import { Deferred } from "../atoms/waiting";

interface ResetAction {
  type: "reset";
}
interface ResolveAction<T> {
  type: "resolve";
  payload: T;
}

export const atomWithDeferred = <T,>() => {
  const anAtom = atom<Deferred<T>>(new Deferred<T>());
  const bAtom = atom(
    (get) => {
      return get(anAtom).promise;
    },
    (get, set, action: ResetAction | ResolveAction<T>) => {
      const dfd = get(anAtom)
      if (action.type === "reset") {
        set(anAtom, new Deferred<T>());
      } else {
        dfd.resolve(action.payload);
      }
    }
  );
  return bAtom;
};
