import { atom, Getter } from "jotai";

const atomWithCondition = (option: (get: Getter) => [any, boolean]) => {
  return atom((get) => {
    const [fn, ready] = option(get);
    if (!ready) {
      return new Promise(() => {});
    }
    return fn(get);
  });
};
