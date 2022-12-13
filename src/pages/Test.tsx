import { useAtomValue } from "jotai";
import { userAtom } from "./atoms";

export const Test = () => {
  const user = useAtomValue(userAtom);
  return <>{JSON.stringify(user)}</>;
};
