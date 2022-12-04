import { useAtom, useAtomValue } from "jotai";
import { cache } from "../atoms/cache";
import { Count, incAtom } from "./atoms";
import { ReloadBtn } from "./Refresh";

const cachedIncAtom = cache(incAtom);

export const Cache = () => {
  const [count, dispatch] = useAtom(cachedIncAtom);
  console.log("Cache.tsx:9", count);
  return (
    <>
      <div>cached count: {count}</div>
      <button
        onClick={() => {
          dispatch({ type: "mutate", payload: 10 });
        }}
      >
        mutate - 改变缓存值并显示出来
      </button>
      <button
        onClick={() => {
          dispatch({ type: "clear" });
        }}
      >
        clear - 只清缓存不执行reload
      </button>
      <Count />
      <ReloadBtn />
    </>
  );
};
