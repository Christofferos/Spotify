import { useSession } from 'next-auth/react'
import { useSpotify } from '../hooks/useSpotify'
import { useSongInfo } from '../hooks/useSongInfo'
import { useRecoilState } from 'recoil'
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom'
import { useCallback, useEffect, useState } from 'react'
import {
  HeartIcon,
  VolumeUpIcon as VolumeDownIcon,
} from '@heroicons/react/outline'
import {
  RewindIcon,
  SwitchHorizontalIcon,
  ReplyIcon,
  PlayIcon,
  PauseIcon,
  FastForwardIcon,
  VolumeUpIcon,
  CalanderIcon,
} from '@heroicons/react/solid'
import { debounce } from 'lodash'
import { playlistState } from '../atoms/playlistAtom'

export const Player = () => {
  const spotifyApi = useSpotify()
  const { data: session, status } = useSession()
  const [currentTrackId, setCurrentIdTrack] =
    useRecoilState(currentTrackIdState)
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)
  const [volume, setVolume] = useState(50)
  const [isShuffle, setIsShuffle] = useState(false)
  const [isRepeat, setIsRepeat] = useState(false)
  const songInfo = useSongInfo()

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body?.is_playing) {
        spotifyApi.pause()
        setIsPlaying(false)
      } else {
        spotifyApi.play().catch((err) => console.log(err))
        setIsPlaying(true)
      }
    })
  }

  const fetchCurrentSong = () => {
    spotifyApi
      .getMyCurrentPlayingTrack()
      .then((data) => {
        setCurrentIdTrack(data.body?.item?.id)
        spotifyApi.getMyCurrentPlaybackState().then((data) => {
          const isRepeatOn = data.body?.repeat_state !== 'off'
          setIsRepeat(isRepeatOn)
          setIsShuffle(data.body?.shuffle_state)
          setIsPlaying(data.body?.is_playing)
        })
      })
      .catch((err) => console.log(err))
  }
  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrackId) {
      if (!songInfo) fetchCurrentSong()
      setVolume(50)
    }
  }, [currentTrackId, spotifyApi, session])

  const debouncedAdjustVolume = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume).catch((err) => {})
    }, 500),
    []
  )

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debouncedAdjustVolume(volume)
    }
  }, [volume])

  return (
    <div className="grid h-24 grid-cols-4 bg-gradient-to-b from-black to-gray-900 px-2 text-xs text-white md:grid-cols-3 md:px-8 md:text-base">
      {/* Left */}
      <div className="flex items-center space-x-4">
        <img
          className="hidden h-10 w-10 md:inline"
          src={songInfo?.album?.images?.[0]?.url}
          alt=""
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists?.[0]?.name}</p>
        </div>
      </div>
      {/* Center section */}
      <div className="col-span-2 flex flex-col justify-center md:col-span-1">
        <div className="flex flex-row items-center justify-evenly">
          <SwitchHorizontalIcon
            className={`button ${isShuffle ? 'fill-green-500' : null} h-8 w-8`}
            onClick={() => {
              spotifyApi.setShuffle(!isShuffle).catch((err) => console.log(err))
              setIsShuffle(!isShuffle)
            }}
          />
          <RewindIcon
            className="button h-10 w-10"
            onClick={() => {
              spotifyApi
                .skipToPrevious()
                .then(() => setTimeout(() => fetchCurrentSong(), 250))
            }}
          />
          {isPlaying ? (
            <PauseIcon onClick={handlePlayPause} className="button h-12 w-12" />
          ) : (
            <PlayIcon onClick={handlePlayPause} className="button h-12 w-12" />
          )}
          <FastForwardIcon
            className="button h-10 w-10"
            onClick={() => {
              spotifyApi
                .skipToNext()
                .then(() => setTimeout(() => fetchCurrentSong(), 250))
            }}
          />
          <ReplyIcon
            className={`button ${isRepeat ? 'fill-green-500' : null} h-8 w-8`}
            onClick={() => {
              const newIsRepeatState = !isRepeat
              setIsRepeat(newIsRepeatState)
              const repeatType = newIsRepeatState ? 'track' : 'off'
              spotifyApi.setRepeat(repeatType)
            }}
          />
        </div>
        {/* <input
          className="w-45"
          type="range"
          value={volume}
          min={0}
          max={100}
          onChange={() => console.log('H')}
        /> */}
      </div>
      {/* Right */}
      <div className="flex hidden items-center justify-end space-x-3 pr-5 md:flex md:space-x-4">
        <VolumeDownIcon
          onClick={() => volume > 0 && setVolume(volume - 10)}
          className="button"
        />
        <input
          className="w-14 md:w-28"
          type="range"
          value={volume}
          min={0}
          max={100}
          onChange={(e) => setVolume(Number(e.target.value))}
        />
        <VolumeUpIcon
          onClick={() => volume < 100 && setVolume(volume + 10)}
          className="button"
        />
      </div>
    </div>
  )
}
