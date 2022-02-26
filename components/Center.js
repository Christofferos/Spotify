import { ChevronDownIcon } from '@heroicons/react/outline'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { shuffle } from 'lodash'
import { useRecoilState } from 'recoil'
import { playlistIdState, playlistState } from '../atoms/playlistAtom'
import { useSpotify } from '../hooks/useSpotify'
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
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState)
  const [playlist, setPlaylist] = useRecoilState(playlistState)

  useEffect(() => {
    setColor(shuffle(colors).pop())
  }, [playlistId])
  useEffect(() => {
    spotifyApi
      .getPlaylist(playlistId)
      .then((data) => {
        setPlaylist(data.body)
      })
      .catch((err) => {
        console.error('Something went wrong!', err)
      })
  }, [spotifyApi, playlistId])

  console.log('Playlist', playlist)

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
        <img
          className="h-44 w-44 shadow-2xl"
          src={playlist?.images?.[0]?.url}
          alt=""
        />
        <div>
          <p>PLAYLIST</p>
          <h4 className="text-2xl font-bold md:text-2xl xl:text-5xl">
            {playlist?.name}
          </h4>
        </div>
      </section>
      <div>
        <Songs />
      </div>
    </div>
  )
}
