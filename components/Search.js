import { ChartBarIcon, XIcon, SearchIcon } from '@heroicons/react/outline'
import { useRecoilState } from 'recoil'
import { songAnalyticsState } from '../atoms/playlistAtom'
import { debounce } from 'lodash'
import { useSpotify } from '../hooks/useSpotify'
import { useCallback, useEffect, useState } from 'react'

export const Search = () => {
  const spotifyApi = useSpotify()
  const [foundSongs, setFoundSongs] = useState([])
  const [search, setSearch] = useState('')
  const debouncedSearch = useCallback(
    debounce((query) => {
      const types = ['album', 'artist', 'playlist', 'track', 'show', 'episode']
      spotifyApi
        ?.search(query, types, { limit: 3 })
        .then((data) => {
          setFoundSongs(data.body?.tracks?.items)
        })
        .catch((err) => console.error(err))
    }, 500),
    []
  )
  useEffect(() => {
    if (search.length > 0) {
      debouncedSearch(search)
    } else if (search.length === 0) {
      setFoundSongs([])
    }
  }, [search])

  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-5">
      <h4 className="md:text-2l xl:text-5l p-5 text-4xl font-bold text-white">
        SEARCH
      </h4>
      <div className="flex w-64 flex-row rounded-full bg-white hover:opacity-80">
        <SearchIcon className="h-7 w-7 pl-1" />
        <input
          className="w-48 pl-3 text-black outline-none"
          placeholder="Artists, songs or podcasts"
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      {foundSongs?.map((song, key) => {
        return (
          <img
            className="h-44 w-44 shadow-2xl"
            src={song?.album?.images?.[0]?.url}
            key={key}
            alt=""
          />
        )
      })}
    </div>
  )
}
