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
      <div>
        <p>
          建立一个缓存对象，用于避免再次进入 suspense 状态，返回两个值
          <code>[缓存内容，修改缓存]</code>。
        </p>
        <p>这个对象使用要看场合，例如：</p>
        一个请求接口，触发refresh的时机可能有两种：1是主动触发，2是被动触发。这里的被动触发可能是窗口重新聚焦时会自动触发。我们希望主动触发时组件会进入suspense状态，而被动触发时不进入。这时候
        cacheAtom 可能无法满足。 我们需要从触发的行为上对这个 asyncAtom
        走出区分，类似startTransition 的逻辑才更合理
      </div>
    </>
  );
};
