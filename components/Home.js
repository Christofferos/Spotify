import { ChartBarIcon, XIcon } from '@heroicons/react/outline'
import { isInteger } from 'lodash'
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { songAnalyticsState } from '../atoms/playlistAtom'
import { useSpotify } from '../hooks/useSpotify'
import { colors } from './Center'
import Range from 'rc-slider'
import 'rc-slider/assets/index.css'
import TooltipSlider, { handleRender } from './TooltipSlider'

export const Home = ({ color }) => {
  const spotifyApi = useSpotify()
  const [genres, setGenres] = useState(null)
  const [selectedGenres, setSelectedGenres] = useState([])

  const selectGenre = (e) => {
    const value = e.target.id
    if (value === '') return
    if (selectedGenres?.includes(value)) {
      setSelectedGenres(selectedGenres.filter((i) => i !== value))
      return
    }
    if (selectedGenres?.length > 4) return
    setSelectedGenres((prevState) => [...prevState, value])
  }

  useEffect(() => {
    spotifyApi
      .getAvailableGenreSeeds()
      .then((data) => setGenres(data.body?.genres))
      .catch((err) => console.error(err))
  }, [])

  const songAttributes = [
    'danceability',
    'energy',
    'speachiness',
    'popularity',
    'tempo',
  ]

  return (
    <div>
      <section
        className={`flex h-80 items-end space-x-7 bg-gradient-to-b p-8 ${color} to-black text-white`}
      >
        <div>
          <h4 className="text-2xl font-bold md:text-2xl xl:text-5xl">
            DISCOVER
          </h4>
        </div>
        <button
          onClick={() => {
            spotifyApi
              .getRecommendations({ seed_genres: selectedGenres, limit: 10 })
              .then((data) => console.log(data))
              .catch((err) => console.error(err))
            // Recommendations: based on danceability, energy, speachiness, popularity, tempo (.getRecommendations())
            // Discover: .getAvailableGenreSeeds()
          }}
        >
          SEARCH
        </button>
      </section>
      <div className="align-center flex flex-wrap justify-center">
        {songAttributes?.map((songAttribute, key) => (
          <div className="mr-10 h-24 w-1/4 gap-1 text-white md:w-28" key={key}>
            <p>{songAttribute.toUpperCase()}</p>
            <TooltipSlider
              range
              min={0}
              max={10}
              defaultValue={[0, 10]}
              tipFormatter={(value) => `${value}`}
              marks={{ 0: 0, 10: 10 }}
            />
          </div>
        ))}
      </div>
      <div
        className="flex flex-row flex-wrap space-y-1 px-10 pb-36"
        onClick={selectGenre}
      >
        {genres?.map((genre, key) => {
          return (
            <div
              key={key}
              id={genre}
              className={`mr-3 flex cursor-pointer items-center rounded-full bg-gradient-to-b ${color} to-black p-1 pr-2 text-white ${
                !selectedGenres.includes(genre) && 'opacity-50'
              }`}
            >
              {genre}
            </div>
          )
        })}
      </div>
    </div>
  )
}
