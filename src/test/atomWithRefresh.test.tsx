import { atom, useAtom } from "jotai";
import { startTransition, Suspense, useState } from "react";
import { act, create } from "react-test-renderer";
import { atomWithRefresh } from "../atoms/atomWithRefresh";

const countAtom = atom(0);

const timeout = (t: number) => new Promise(r => setTimeout(r, t));

let count = 0;

const heroAtom = atomWithRefresh(async () => {
  await timeout(2000);
  return count++;
})

const Counter = () => {
  const [count, run] = useAtom(heroAtom);
  
  return (
    <>
      <p>{count}</p>
      <button onClick={() => {
        startTransition(() => {
          run()
        })
      }}>one up</button>
    </>
  );
};

test("atomWithRefresh", async () => {
  const component = create(<Suspense fallback={<></>}><Counter /></Suspense>);

  const instance = component.root;
  const button = instance.findByType("button");
  const text = instance.findByType("p");
  await act(() => button.props.onClick());
  expect(text.props.children).toBe(1);
});
