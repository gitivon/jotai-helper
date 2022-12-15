import { atom, useAtom } from "jotai";
import { useState } from "react";

const mountAtom = atom(0);

mountAtom.onMount = (set) => {
  set(-1);
  console.log("OnMount.tsx:6", "mount");
  return () => {
    console.log("OnMount.tsx:7", "unmount");
  };
};

const Child = () => {
  const [count, setCount] = useAtom(mountAtom);
  return <>{count}</>;
};

export const OnMount = () => {
  const [count, setCount] = useAtom(mountAtom);
  const [show, setShow] = useState(false);
  return (
    <>
      {count}
      <button onClick={() => setShow((v) => !v)}>toggle</button>
      {show && <Child />}
      <button onClick={() => setCount((c) => c + 1)}>+1</button>
    </>
  );
};
