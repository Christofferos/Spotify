import { useRecoilState, useRecoilValue } from 'recoil'
import { showsState } from '../atoms/playlistAtom'
import Show from './Show'

export const Shows = () => {
  const [shows] = useRecoilState(showsState)
  return (
    <div className="flex flex-col space-y-1 px-8 pb-28 text-white">
      {shows?.map((show, i) => {
        return <Show key={show.show.id} order={i} show={show} />
      })}
    </div>
  )
}
