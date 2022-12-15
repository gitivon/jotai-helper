# useAtom

```ts
export function useAtom<Value, Update, Result extends void | Promise<void>>(
  atom: Atom<Value> | WritableAtom<Value, Update, Result>,
  scope?: Scope
) {
  // ...
  return [
    useAtomValue(atom, scope),
    // We do wrong type assertion here, which results in throwing an error.
    useSetAtom(atom as WritableAtom<Value, Update, Result>, scope),
  ];
}
```

可见 useAtom 可以理解为是 useAtomValue 和 useSetAtom 的组合

## useAtomValue

```ts
const ScopeContext = getScopeContext(scope);
const scopeContainer = useContext(ScopeContext);
const { s: store, v: versionFromProvider } = scopeContainer;
```

从 scope 中获取 store 容器

```ts
const ScopeContextMap = new Map<Scope | undefined, ScopeContext>();

export const getScopeContext = (scope?: Scope) => {
  if (!ScopeContextMap.has(scope)) {
    ScopeContextMap.set(scope, createContext(createScopeContainer()));
  }
  return ScopeContextMap.get(scope) as ScopeContext;
};
```

这里如果 scope 不传，会在 Map 中用 undefined 作为一个 key 去查找。所以如果不写 scope 就相当于用了全局的一个 undefined 为 Key 的 scope，关于 scope 部分另章节再看吧

顺着代码往下看，这里定义了一个获取 atomValue 的方法：

```ts
const getAtomValue = (version?: VersionObject) => {
  // This call to READ_ATOM is the place where derived atoms will actually be
  // recomputed if needed.
  const atomState = store[READ_ATOM](atom, version);
  if (__DEV__ && !atomState.y) {
    throw new Error("should not be invalidated");
  }
  if ("e" in atomState) {
    throw atomState.e; // read error
  }
  if ("p" in atomState) {
    throw atomState.p; // read promise
  }
  if ("v" in atomState) {
    return atomState.v as Awaited<Value>;
  }
  throw new Error("no atom value");
};
```

这里的 atomState 从 context scope 中获取，

根据 scopeContainer 的定义，分别有 s,w,v,r 四个属性，其中的 s 就是我们的 atomState

```ts
export interface ScopeContainer {
  s: Store;
  w?: VersionedWrite;
  v?: object; // version object
  r?: RetryFromError;
}
```

Store 的定义比较复杂，没有直接给出而是通过 ReturnType 推导来的，大概是这样

```ts
interface Store {
  [READ_ATOM]: readAtom; // "r"
  [WRITE_ATOM]: writeAtom; // "W"
  [COMMIT_ATOM]: commitAtom; // "c"
  [SUBSCRIBE_ATOM]: subscribeAtom; // "s"
  [RESTORE_ATOMS]: restoreAtoms; // "h"
}
```

这里面四个常量就是个字符串

回到上面，我们追溯一下 `store[READ_ATOM]`方法

```ts
const readAtom = <Value>(
  readingAtom: Atom<Value>,
  version?: VersionObject
): AtomState<Value> => {
  const atomState = readAtomState(version, readingAtom);
  return atomState;
};
```

atomState 类型如下

```ts
type AtomState<Value = AnyAtomValue> = {
  /**
   * Counts number of times atom has actually changed or recomputed.
   * 一个计数，记录atom实际改变的次数
   */
  r: Revision;
  /**
   * Validit(y) of the atom state.
   * Mounted atoms are considered invalidated when `y === false`.
   */
  y: boolean;
  /**
   * Maps from a dependency to the dependency's revision when it was last read.
   * We can skip recomputation of an atom by comparing the ReadDependencies revision
   * of each dependency to that dependencies's current revision.
   * 记录了依赖项
   */
  d: ReadDependencies; // ReadDependencies = Map<AnyAtom, Revision>
  // 下面三个只会同时存在一个
  e: ReadError;
  p: SuspensePromise;
  v: Awaited<Value>;
};

/** 
 * suspensePromise 类型是在 promise类型的基础上增加了一个 Symbol对象，对象包含了

  b: Promise<unknown> // base promise
  o: Promise<void> // original promise
  c: (() => void) | null // cancel promise (null if already cancelled)
  */
export type SuspensePromise = Promise<void> & {
  [SUSPENSE_PROMISE]: SuspensePromiseExtra;
};
```

atomState 中 p 表示一个 suspensepromise 状态，同时附带一个 c 方法可以用来取消这个 promise

`readAtomState` 的定义有点长

```ts
const readAtomState = <Value>(
  version: VersionObject | undefined,
  atom: Atom<Value>,
  force?: boolean
): AtomState<Value> => {
  if (!force) {
    // See if we can skip recomputing this atom.
    const atomState = getAtomState(version, atom);
    if (atomState) {
      // First, check if we already have suspending promise
      if (
        atomState.y && // not invalidated
        "p" in atomState &&
        !isSuspensePromiseAlreadyCancelled(atomState.p)
      ) {
        return atomState;
      }
      // Second, ensure that each atom we depend on is up to date.
      // Recursive calls to `readAtomState(version, a)` will recompute `a` if
      // it's out of date thus increment its revision number if it changes.
      atomState.d.forEach((_, a) => {
        if (a !== atom) {
          if (!mountedMap.has(a)) {
            // Dependency is new or unmounted.
            // Invalidation doesn't touch unmounted atoms, so we need to recurse
            // into this dependency in case it needs to update.
            readAtomState(version, a);
          } else {
            // Dependency is mounted.
            const aState = getAtomState(version, a);
            if (
              aState &&
              !aState.y // invalidated
            ) {
              readAtomState(version, a);
            }
          }
        }
      });
      // If a dependency's revision changed since this atom was last computed,
      // then we're out of date and need to recompute.
      if (
        Array.from(atomState.d).every(([a, r]) => {
          const aState = getAtomState(version, a);
          return (
            aState &&
            !("p" in aState) && // has no suspense promise
            aState.r === r // revision is equal to the last one
          );
        })
      ) {
        if (
          !atomState.y // invalidated
        ) {
          return { ...atomState, y: true };
        }
        return atomState;
      }
    }
  }
  // Compute a new state for this atom.
  const dependencies = new Set<AnyAtom>();
  try {
    const promiseOrValue = atom.read(<V>(a: Atom<V>) => {
      dependencies.add(a);
      const aState =
        (a as AnyAtom) === atom
          ? getAtomState(version, a)
          : readAtomState(version, a);
      if (aState) {
        if ("e" in aState) {
          throw aState.e; // read error
        }
        if ("p" in aState) {
          throw aState.p; // suspense promise
        }
        return aState.v as Awaited<V>; // value
      }
      if (hasInitialValue(a)) {
        return a.init;
      }
      // NOTE invalid derived atoms can reach here
      throw new Error("no atom init");
    });
    return setAtomPromiseOrValue(version, atom, promiseOrValue, dependencies);
  } catch (errorOrPromise) {
    if (errorOrPromise instanceof Promise) {
      const suspensePromise =
        isSuspensePromise(errorOrPromise) &&
        isSuspensePromiseAlreadyCancelled(errorOrPromise)
          ? copySuspensePromise(errorOrPromise)
          : createSuspensePromise(errorOrPromise, errorOrPromise);
      return setAtomSuspensePromise(
        version,
        atom,
        suspensePromise,
        dependencies
      );
    }
    return setAtomReadError(version, atom, errorOrPromise, dependencies);
  }
};
```
