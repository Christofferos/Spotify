import { useRecoilState, useRecoilValue } from 'recoil'
import { DISPLAY_TYPE, episodesState, showsState } from '../atoms/playlistAtom'
import Episode from './Episode'

export const Episodes = () => {
  const episodes = useRecoilValue(episodesState)
  return (
    <div className="flex flex-col space-y-1 px-8 pb-28 text-white">
      {episodes?.map((episode, i) => {
        return <Episode key={episode.id} order={i} episode={episode} />
      })}
    </div>
  )
}
