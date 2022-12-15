# atom

```ts
let keyCount = 0; // global key count for all atoms
export function atom<Value, Args extends unknown[], Result>(
  read: Value | Read<Value, SetAtom<Args, Result>>,
  write?: Write<Args, Result>
) {
  const key = `atom${++keyCount}`; // 内部通过自增id来记录key值
  const config = {
    toString: () => key,
  } as WritableAtom<Value, Args, Result> & { init?: Value };
  if (typeof read === "function") {
    // 如果 read 是函数，直接复制即可
    config.read = read as Read<Value, SetAtom<Args, Result>>;
  } else {
    // 否则 read 被识别为初始值，并设置 read 方法为一个调用自己的函数
    config.init = read;
    config.read = (get) => get(config);
    config.write = ((get: Getter, set: Setter, arg: SetStateAction<Value>) =>
      set(
        config as unknown as PrimitiveAtom<Value>,
        typeof arg === "function"
          ? (arg as (prev: Value) => Value)(get(config))
          : arg
      )) as unknown as Write<Args, Result>;
  }
  if (write) {
    config.write = write;
  }
  return config; // 所以执行完atom()后得到的就是个 config对象而已
}
```

### 解析 config

```ts
interface config {
  toString: () => string;
  read: Read<Value, SetAtom<Args, Result>>;
  init: Value;
  write: Write<Args, Result>;
}
```
