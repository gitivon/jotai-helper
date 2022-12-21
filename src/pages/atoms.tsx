import { atom, useAtomValue } from "jotai";
import { abortableAtom, loadable, selectAtom } from "jotai/utils";
import { refresh } from "../atoms/refresh";
import { select } from "../atoms/select";
import { withSuspense } from "../utils/withSuspense";

export const timeout = (t: number) => new Promise((r) => setTimeout(r, t));

export const countAtom = atom(0);

export const baseIncAtom = refresh(
  atom(async () => {
    await timeout(1e3);
    return count++;
  })
);
let count = 0;

export const incAtom = select(baseIncAtom, (v) => v.data);
export const incLoadingAtom = select(baseIncAtom, (v) => v.isLoading);

export const Count = withSuspense(() => {
  return <>count：{useAtomValue(incAtom)}</>;
}, "countAtom is loading...");

interface User {
  id: number;
  name: string;
}
interface Post {
  id: number;
  title: string;
}

export const userAtom = refresh(
  abortableAtom(async (get, { signal }) => {
    const userId = get(incAtom);
    await timeout(2e3);
    const response = await fetch(
      `https://my-json-server.typicode.com/gitivon/jotai-helper/users`,
      { signal }
    );
    const data: User[] = await response.json();
    return data.find((i) => i.id === userId);
  })
);

export const postAtom = refresh(
  abortableAtom(async (get, { signal }) => {
    console.log("postAtom start...");
    const id = get(incAtom);
    await timeout(2e3);
    const response = await fetch(
      `https://my-json-server.typicode.com/gitivon/jotai-helper/posts`,
      { signal }
    );
    const data: Post[] = await response.json();
    console.log("postAtom end");
    return data.find((i) => i.id === id);
  })
);

export const localUserAtom = refresh(
  abortableAtom(async (get, { signal }) => {
    const userId = get(incAtom);
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
