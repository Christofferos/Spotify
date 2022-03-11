import { ChartBarIcon, XIcon } from '@heroicons/react/outline'
import { useRecoilState } from 'recoil'
import { songAnalyticsState } from '../atoms/playlistAtom'

export const SongAnalytics = () => {
  const [songAnalytics, setSongAnalytics] = useRecoilState(songAnalyticsState)
  return (
    <header className="absolute left-1/2 top-5">
      <div
        className="flex cursor-pointer flex-col items-center space-x-3 rounded-lg bg-black p-1 pr-2 text-white opacity-90 hover:opacity-80"
        onClick={() => setSongAnalytics(null)}
      >
        <ChartBarIcon className="h-5 w-5" />
        <h2>Energy: {songAnalytics?.energy}</h2>
        <h2>Valence: {songAnalytics?.valence}</h2>
        <h2>Tempo: {songAnalytics?.tempo}</h2>
        <h2>Dancability: {songAnalytics?.danceability}</h2>
        <h2>Speachiness: {songAnalytics?.speechiness}</h2>
        <h2>Acousticness: {songAnalytics?.acousticness}</h2>
        <XIcon className="h-5 w-5" />
      </div>
    </header>
  )
}
