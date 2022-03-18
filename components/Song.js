import { useState } from 'react'
import { useToasts } from 'react-toast-notifications'
import { CalendarIcon, ChartBarIcon } from '@heroicons/react/outline'
import { useSpotify } from '../hooks/useSpotify'
import { millisToMinutesAndSeconds } from '../lib/time'
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom'
import { useRecoilState } from 'recoil'
import { playlistState, songAnalyticsState } from '../atoms/playlistAtom'

const Song = ({ order, track }) => {
  const spotifyApi = useSpotify()
  const { addToast } = useToasts()
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState)
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)
  const [playlist, setPlaylist] = useRecoilState(playlistState)
  const [songAnalytics, setSongAnalytics] = useRecoilState(songAnalyticsState)

  const playSong = () => {
    setCurrentTrackId(track.track.id)
    setIsPlaying(true)
    spotifyApi
      .play({
        uris: playlist?.tracks?.items.map((item) => item.track.uri),
        offset: { position: order },
        // contextUri: playlist.uri,
      })
      .catch((err) => console.log(err))
  }

  return (
    <div
      className="grid cursor-pointer grid-cols-2 rounded-lg py-4 px-0 text-gray-500 hover:bg-gray-900 md:px-5"
      onClick={playSong}
    >
      <div className="flex items-center space-x-4">
        <p>{order + 1}</p>
        <img
          className="h-10 w-10"
          src={track.track.album.images[0].url}
          alt=""
        />
        <div>
          <p className="w-36 truncate text-white lg:w-64">{track.track.name}</p>
          <p className="w-40">{track.track.artists[0].name}</p>
        </div>
      </div>

      <div className="ml-auto flex items-center justify-between md:ml-0">
        <p className="hidden w-40 md:inline">{track.track.album.name}</p>
        <p>{millisToMinutesAndSeconds(track.track.duration_ms)}</p>
        {/* 📅 */}
        <div className="flex flex-row">
          <p className="mx-2 flex h-6 w-6 items-center justify-center rounded-3xl bg-white">
            <CalendarIcon
              className="button h-4 w-4 stroke-black"
              onClick={(e) => {
                spotifyApi
                  .addToQueue(track.track.uri)
                  .then(() => {
                    addToast('Song Queued', {
                      appearance: 'success',
                      autoDismiss: true,
                      autoDismissTimeout: 500,
                    })
                  })
                  .catch((err) => {
                    console.log(err)
                    addToast('Queue Error', {
                      appearance: 'error',
                      autoDismiss: true,
                    })
                  })
                e.stopPropagation()
              }}
            />
          </p>
          <p className="mx-2 flex h-6 w-6 items-center justify-center rounded-3xl bg-white">
            <ChartBarIcon
              className="button h-4 w-4 stroke-black"
              onClick={(e) => {
                spotifyApi
                  .getAudioFeaturesForTrack(track.track.id)
                  .then((data) => {
                    console.log('Analytics ', data?.body)
                    setSongAnalytics({
                      energy: Math.round(data?.body?.energy * 100),
                      valence: Math.round(data?.body?.valence * 100),
                      tempo: Math.round(data?.body?.tempo),
                      danceability: Math.round(data?.body?.danceability * 100),
                      speechiness: Math.round(data?.body?.speechiness * 100),
                      acousticness: Math.round(data?.body?.acousticness * 100),
                      liveliness: Math.round(data?.body?.liveness * 100),
                    })
                  })
                  .catch((err) => console.log(err))
                e.stopPropagation()
              }}
            />
          </p>
        </div>
      </div>
    </div>
  )
}

export default Song
