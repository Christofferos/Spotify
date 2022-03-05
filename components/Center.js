import { XIcon, ChartBarIcon, ChevronDownIcon } from '@heroicons/react/outline'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { shuffle } from 'lodash'
import { useRecoilState } from 'recoil'
import {
  playlistIdState,
  playlistState,
  centerDisplayState,
  DISPLAY_TYPE,
  showsState,
  showIdState,
  episodesState,
  songAnalyticsState,
} from '../atoms/playlistAtom'
import { useSpotify } from '../hooks/useSpotify'
import { Shows } from './Shows'
import { Episodes } from './Episodes'
import { Songs } from './Songs'
import { signOut } from 'next-auth/react'

const colors = [
  'from-indigo-500',
  'from-blue-500',
  'from-green-500',
  'from-red-500',
  'from-yellow-500',
  'from-pink-500',
  'from-purple-500',
]

export const Center = () => {
  const spotifyApi = useSpotify()
  const { data: session } = useSession()
  const [color, setColor] = useState(null)
  const [playlistId] = useRecoilState(playlistIdState)
  const [, setPlaylist] = useRecoilState(playlistState)
  const [, setShows] = useRecoilState(showsState)
  const [, setEpisodes] = useRecoilState(episodesState)
  const [centerDisplay] = useRecoilState(centerDisplayState)
  const [showId] = useRecoilState(showIdState)
  const [songAnalytics, setSongAnalytics] = useRecoilState(songAnalyticsState)
  const [metaData, setMetaData] = useState({ name: '', imgUrl: '' })

  const isSavedSongsView = centerDisplay === DISPLAY_TYPE.SAVED_TRACKS
  const isShowView = centerDisplay === DISPLAY_TYPE.SAVED_SHOWS
  const isEpisodesView = centerDisplay === DISPLAY_TYPE.SAVED_EPISODES

  useEffect(() => {
    setColor(shuffle(colors).pop())
  }, [playlistId])
  useEffect(() => {
    if (centerDisplay === DISPLAY_TYPE.SAVED_TRACKS) {
      spotifyApi
        .getMySavedTracks({ limit: 50 })
        .then((data) => {
          const imgUrl = data.body?.items?.[0]?.track?.album?.images?.[0]?.url
          setPlaylist({
            id: 'likedSongs',
            name: 'Liked Songs',
            uri: '',
            tracks: data?.body,
            images: [{ url: imgUrl }],
          })
          setMetaData({ imgUrl, name: 'Liked Songs' })
        })
        .catch((err) => console.error('Failed to retrieve saved tracks ', err))
    } else if (isShowView) {
      spotifyApi
        .getMySavedShows({ limit: 10 })
        .then((data) => {
          const imgUrl = data.body?.items?.[0]?.show?.images?.[0]?.url
          setShows(data?.body?.items)
          setMetaData({ imgUrl, name: 'Your Podcasts' })
        })
        .catch((err) => console.log(err))
    } else if (isEpisodesView) {
      spotifyApi.getShowEpisodes(showId).then((data) => {
        const imgUrl = data.body?.items?.[0]?.images?.[0]?.url
        setMetaData({ imgUrl, name: 'The Episodes' })
        setEpisodes(data?.body?.items)
      })
    } else if (centerDisplay === DISPLAY_TYPE.PLAYLIST) {
      spotifyApi
        .getPlaylist(playlistId)
        .then((data) => {
          setPlaylist(data?.body)
          setMetaData({
            imgUrl: data?.body?.images?.[0]?.url,
            name: data?.body?.name,
          })
        })
        .catch((err) => {
          console.error('Something went wrong!', err)
        })
    }
  }, [spotifyApi, playlistId, centerDisplay])

  const isSongPlaylistView =
    centerDisplay === DISPLAY_TYPE.PLAYLIST ||
    centerDisplay === DISPLAY_TYPE.SAVED_TRACKS

  return (
    <div className="h-screen flex-grow overflow-y-scroll scrollbar-hide">
      <header className="absolute top-5 right-8">
        <div
          className="flex cursor-pointer items-center space-x-3 rounded-full bg-black p-1 pr-2 text-white opacity-90 hover:opacity-80"
          onClick={signOut}
        >
          <img
            className="h-10 w-10 rounded-full"
            src={session?.user.image}
            alt=""
          />
          <h2>{session?.user.name}</h2>
          <ChevronDownIcon className="h-5 w-5" />
        </div>
      </header>
      <section
        className={`flex h-80 items-end space-x-7 bg-gradient-to-b p-8 ${color} to-black text-white`}
      >
        <img className="h-44 w-44 shadow-2xl" src={metaData?.imgUrl} alt="" />
        <div>
          <p>PLAYLIST</p>
          <h4 className="text-2xl font-bold md:text-2xl xl:text-5xl">
            {metaData?.name}
          </h4>
        </div>
      </section>
      <div>
        {isSongPlaylistView && <Songs />}
        {isShowView && <Shows />}
        {isEpisodesView && <Episodes />}
      </div>
      {songAnalytics && (
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
      )}
    </div>
  )
}
