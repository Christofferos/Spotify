import {
  HomeIcon,
  SearchIcon,
  LibraryIcon,
  PlusCircleIcon,
  RssIcon,
  HeartIcon,
} from '@heroicons/react/outline'
import Link from 'next/link'
import { signOut, useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { useSpotify } from '../hooks/useSpotify'
import { centerDisplayState, playlistIdState } from '../atoms/playlistAtom'
import { DISPLAY_TYPE } from './Center'

export const Sidebar = () => {
  const spotifyApi = useSpotify()
  const [playlists, setPlaylists] = useState([])
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState)
  const { data: session, status } = useSession()
  const [, setCenterDisplay] = useRecoilState(centerDisplayState)

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then((data) => {
        setPlaylists(data.body.items)
      })
    }
  }, [session, spotifyApi])

  return (
    <div className="hidden h-screen shrink-0 overflow-y-scroll border-r border-gray-900 p-5 pb-36 text-xs text-gray-500 scrollbar-hide sm:max-w-[12rem] md:inline-flex lg:max-w-[15rem] lg:text-sm">
      <div className="space-y-4">
        <button
          className="flex items-center space-x-2 hover:text-white"
          onClick={() => {
            setCenterDisplay(DISPLAY_TYPE.HOME)
          }}
        >
          <HomeIcon className="h-5 w-5" />
          <p>Home</p>
        </button>
        <button
          className="flex items-center space-x-2 hover:text-white"
          onClick={() => {
            setCenterDisplay(DISPLAY_TYPE.SEARCH)
          }}
        >
          <SearchIcon className="h-5 w-5" />
          <p>Search</p>
        </button>
        <button
          className="flex items-center space-x-2 hover:text-white"
          onClick={() => {
            setCenterDisplay(DISPLAY_TYPE.LIBRARY)
          }}
        >
          <LibraryIcon className="h-5 w-5" />
          <p>Library</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900" />
        <button className="flex items-center space-x-2 hover:text-white">
          <PlusCircleIcon className="h-5 w-5" />
          <p>Create Playlist</p>
        </button>
        <button
          className="flex items-center space-x-2 hover:text-white"
          onClick={() => {
            setCenterDisplay(DISPLAY_TYPE.SAVED_TRACKS)
          }}
        >
          <HeartIcon className="h-5 w-5" />
          <p>Liked Songs</p>
        </button>
        <button
          className="flex items-center space-x-2 hover:text-white"
          onClick={() => {
            setCenterDisplay(DISPLAY_TYPE.SAVED_SHOWS)
          }}
        >
          <RssIcon className="h-5 w-5" />
          <p>Your Podcasts</p>
        </button>
        <hr className="border-t-[0.1px] border-gray-900" />

        {/* Playlists... */}
        {playlists.map((playlist) => {
          return (
            <p
              key={playlist.id}
              className="cursor-pointer hover:text-white"
              onClick={() => {
                setPlaylistId(playlist.id)
                setCenterDisplay(DISPLAY_TYPE.PLAYLIST)
              }}
            >
              {playlist.name}
            </p>
          )
        })}
      </div>
    </div>
  )
}
