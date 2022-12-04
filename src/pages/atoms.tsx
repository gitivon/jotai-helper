import { atom, useAtomValue } from "jotai";
import { abortableAtom } from "jotai/utils";
import { atomWithRefresh, refresh } from "../atoms/refresh";
import { withSuspense } from "../utils/withSuspense";

export const timeout = (t: number) => new Promise((r) => setTimeout(r, t));

export const countAtom = atom(0);

let count = 0;
export const incAtom = atomWithRefresh(async () => {
  await timeout(1000);
  console.log("atoms.tsx:11", count);
  return count++;
});

export const Count = withSuspense(() => {
  return <>count：{useAtomValue(incAtom)}</>;
}, "countAtom is loading...");

export const userAtom = refresh(
  abortableAtom(async (get, { signal }) => {
    const userId = get(countAtom);
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/users/${userId}?_delay=2000`,
      { signal }
    );
    return response.json();
  })
);
