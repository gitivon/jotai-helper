import { atom, Atom, Getter } from "jotai";
import { Count, countAtom } from "./atoms"
import { ReloadBtn } from "./Refresh"


const watch = (callback: (get: Getter) => void) => {


}

const countWatchAtom = watch((get) => {
  const count = get(countAtom);

});

export const Listener = () => {
  return <>
  
    <Count />
    <ReloadBtn />
  </>
}