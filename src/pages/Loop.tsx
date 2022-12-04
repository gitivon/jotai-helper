import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { loop } from "../atoms/loop";
import { Count, incAtom } from "./atoms";

const autoIncAtom = loop(incAtom, 3000, false);

export const Loop = () => {
  return (
    <>
      <Count />
      <Switch />
    </>
  );
};

export const Switch = () => {
  const [checked, toggle] = useAtom(autoIncAtom);
  return (
    <div>
      设置自动刷新：
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => {
          console.log("Loop.tsx:22", e);
          toggle(!checked);
        }}
      />
    </div>
  );
};
