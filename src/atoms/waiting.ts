import { atom, Getter } from "jotai";

export const waiting = (option: (get: Getter) => [any, boolean]) => {
  return atom((get) => {
    const [fn, ready] = option(get);
    if (!ready) {
      return new Promise(() => {});
    }
    return fn(get);
  });
};
