import { atom, Atom } from "jotai";

export const broadcast = <Value>(baseAtom: Atom<Value>, key: string) => {
    const listeners = new Set<(event: MessageEvent<any>) => void>()
    const channel = new BroadcastChannel(key)
    channel.onmessage = (event) => {
      listeners.forEach((l) => l(event))
    }
    const broadcastAtom = atom<Value, { isEvent: boolean; value: Value }>(
      (get) => get(baseAtom),
      (get, set, update) => {
        if ('write' in baseAtom) {
          set(baseAtom, update.value)
        }
        if (!update.isEvent) {
          channel.postMessage(get(baseAtom))
        }
      }
    )
    broadcastAtom.onMount = (setAtom) => {
      const listener = (event: MessageEvent<any>) => {
        setAtom({ isEvent: true, value: event.data })
      }
      listeners.add(listener)
      return () => {
        listeners.delete(listener)
      }
    }
    const returnedAtom = atom<Value, Value>(
      (get) => get(broadcastAtom),
      (get, set, update) => {
        set(broadcastAtom, { isEvent: false, value: update })
      }
    )
    return returnedAtom
}