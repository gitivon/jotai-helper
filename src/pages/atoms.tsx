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
    const userId = get(incAtom);
    const response = await fetch(
      `https://my-json-server.typicode.com/gitivon/jotai-helper/user/${userId}`,
      { signal }
    );
    return response.json();
  })
);

export const localUserAtom = refresh(
  abortableAtom(async (get, { signal }) => {
    const userId = get(incAtom);
    console.log("atoms.tsx:34", userId);
    await timeout(2000);
    return {
      userId,
      name: "用户名",
    };
  })
);

export const localUserDetailAtom = refresh(
  atom(async (get) => {
    const user = get(localUserAtom);
    console.log("atoms.tsx:45", user);
    await timeout(2e3);
    return {
      user,
      detail: "很好",
    };
  })
);
