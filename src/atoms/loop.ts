import type { WritableAtom } from "jotai";
import { atom } from "jotai";

export const loop = <V, Result extends void | Promise<void> = void>(
  baseAtom: WritableAtom<V, unknown, Result>,
  interval: number,
  initialStatus = true
) => {
  const timerAtom = atom<number>(0);
  const runningAtom = atom<boolean>(false);
  const newAtom = atom(
    (get) => get(runningAtom),
    (get, set, val: boolean) => {
      const timer = get(timerAtom);
      if (val && !get(runningAtom)) {
        set(
          timerAtom,
          window.setInterval(() => {
            baseAtom.write(get, set, undefined);
          }, interval)
        );
      }
      if (!val && get(runningAtom)) {
        clearInterval(timer);
      }
      set(runningAtom, val);
    }
  );
  newAtom.onMount = (set) => {
    if (initialStatus) {
      set(true);
    }
  };
  return newAtom;
};
