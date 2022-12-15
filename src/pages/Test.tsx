import { atom, useAtomValue } from "jotai";
import { Count, postAtom } from "./atoms";
import { ReloadBtn } from "./Refresh";

const derivedAtom = atom((get) => {
  const post = get(postAtom);
  return post;
});

export const Test = () => {
  const post = useAtomValue(derivedAtom);
  return (
    <>
      <p>{JSON.stringify(post)}</p>
      <Count />
      <ReloadBtn />
    </>
  );
};
