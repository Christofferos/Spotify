import { useState } from 'react'
import { CalendarIcon } from '@heroicons/react/outline'
import { useSpotify } from '../hooks/useSpotify'
import { millisToMinutesAndSeconds } from '../lib/time'
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom'
import { useRecoilState, useRecoilValue } from 'recoil'
import { episodesState } from '../atoms/playlistAtom'

const Episode = ({ order, episode }) => {
  const spotifyApi = useSpotify()
  const [, setCurrentTrackId] = useRecoilState(currentTrackIdState)
  const [, setIsPlaying] = useRecoilState(isPlayingState)
  const episodes = useRecoilValue(episodesState)

  const playEpisode = () => {
    setCurrentTrackId(episode.id)
    setIsPlaying(true)
    spotifyApi
      .play({
        uris: episodes?.map((item) => item.uri),
        offset: { position: order },
      })
      .catch((err) => console.log(err))
  }

  return (
    <div
      className="grid cursor-pointer grid-cols-2 rounded-lg py-4 px-5 text-gray-500 hover:bg-gray-900"
      onClick={playEpisode}
    >
      <div className="flex items-center space-x-4">
        <p>{order + 1}</p>
        <img className="h-10 w-10" src={episode?.images?.[0]?.url} alt="" />
        <div>
          <p className="w-36 text-white lg:w-64">{episode.name}</p>
          <p className="w-40">{episode.release_date}</p>
        </div>
      </div>

      <div className="ml-auto flex items-center justify-between md:ml-0">
        <p className="hidden w-40 md:inline">
          {episode.description.length > 150
            ? `${episode.description.substring(0, 150)} ...`
            : episode.description}
        </p>
        <p>{millisToMinutesAndSeconds(episode.duration_ms)}</p>
      </div>
    </div>
  )
}

export default Episode
