import { useRecoilValue } from 'recoil'
import { playlistState } from '../atoms/playlistAtom'
import Song from './Song'

export const Songs = () => {
  const playlist = useRecoilValue(playlistState)
  const listOfSongs = playlist?.tracks?.items
  return (
    <div className="flex flex-col space-y-1 px-8 pb-28 text-white">
      {listOfSongs?.map((track, i) => {
        return <Song key={track.track.id} order={i} track={track} />
      })}
    </div>
  )
}
