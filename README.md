# jotai

## Typescript

通过 atom 可以定义三种类型的 atom

### 原始 atom

这是最基本的用法

1. atom(0) 相当于 useState(0)
2. atom 包含 read 和 write 对象，分别描述了读和写的方法
3. setAtom 可以传入一个函数，等同于 setState

类型描述：

```ts
type PrimitiveAtom<Value> = WritableAtom<Value, SetStateAction<Value>>;
```

可以看到 PromitiveAtom 的类型是对于 WritableAtom 的封装，SetStateAction 的定义是

```ts
type SetStateAction<Value> = Value | ((prev: Value) => Value);
```

WritableAtom 第二个泛型表示可以别写入的值类型，这里看到是和 useState 是一样的

### 只读 atom

> `Atom<V>`

> atom((get) => xx)

## jotai 异步

jotai 异步处理是基于 react-suspense 的处理方式来进行的。假如我们要从服务端获取一篇文章信息，可以定义一个 postAtom，如下：

```tsx
import { atom, useAtomValue } from "jotai";

const postAtom = atom(async () => {
  return (await fetch("xxx")).json();
});

const post = useAtomValue(postAtom);
```

当使用了 postAtom 值的组件被渲染到页面上时，如果 postAtom 抛出一个 promise pending 时，会将组件挂起，随后等待这个 promise 被 resolve，才会重新渲染组件，并当组件渲染完成后执行 writableAtom.onMount 方法
