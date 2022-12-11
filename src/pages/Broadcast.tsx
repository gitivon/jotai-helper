import { atom, useAtom } from 'jotai'
import { broadcast } from '../atoms/broadcast'
import { countAtom, incAtom } from './atoms'

const broadAtom = broadcast(countAtom, 'broadcast-key');

export const Broadcast = () => {
  const [count, setCount] = useAtom(broadAtom)
  return (
    <div>
      {count}
      <button onClick={() => setCount(count + 1)}>+1</button>
    </div>
  )
}