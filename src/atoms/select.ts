import { Atom, atom, WritableAtom } from "jotai";
import { selectAtom } from "jotai/utils";

type Selector<Value, Slice> = (v: Value) => Slice;
type MaybePromise<T> = T | Promise<T>;

export function select<T, S, U, R extends MaybePromise<void>>(
  baseAtom: WritableAtom<T, U, R>,
  selector: Selector<T, S>
): WritableAtom<S, U, R>;
export function select<T, S>(
  baseAtom: Atom<T>,
  selector: Selector<T, S>
): Atom<S>;
export function select<T, V, A extends Atom<T>>(
  baseAtom: A,
  selector: (v: T) => V
) {
  return atom(
    (get) => get(selectAtom(baseAtom, selector)),
    "write" in baseAtom ? baseAtom.write : null
  );
}
