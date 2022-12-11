import { atom, Getter } from "jotai";

class EventEmitter {
  constructor() {}
  
}

type Fn<T> = (get: Getter, dfd: Deferred<T>) => T | Promise<T>;

export const waitableAtom = <T>(fn: Fn<T>) => {
  let dfd = new Deferred<T>();

  

  const bAtom = atom((get) => {

  }, () => {

  });

  bAtom.onMount = () => {
    console.log('waiting.ts:24', 'onmount');
  }

  return atom((get) => {
    const res = fn(get, dfd);
    get(bAtom);
    if (res instanceof Promise) {
      console.log("waiting.ts:24", res);
    } else {
      console.log("waiting.ts:22", res);
      dfd.resolve(res);
      return res;
    }
  }, () => {

  });
};


export const useAtomUntil = () => {
  
}

export class Deferred<T> {
  promise: Promise<T>;
  error?: any;
  data?: T;

  constructor() {
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }

  resolve(data: T) {
    this.data = data;
    this.resolve(data);
  }

  reject(error?: any) {
    this.error = error;
    this.reject(error);
  }
}
