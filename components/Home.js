import { ChartBarIcon, XIcon, SearchIcon } from '@heroicons/react/outline'
import { useEffect, useReducer, useState } from 'react'
import { useRecoilState } from 'recoil'
import { songAnalyticsState } from '../atoms/playlistAtom'
import { useSpotify } from '../hooks/useSpotify'
import { colors } from './Center'
import 'rc-slider/assets/index.css'
import TooltipSlider, { handleRender } from './TooltipSlider'
import { currentTrackIdState, isPlayingState } from '../atoms/songAtom'

const reducer = (state, action) => {
  switch (action.type) {
    case 'danceability':
      return { ...state, danceability: action.newVal }
    case 'energy':
      return { ...state, energy: action.newVal }
    case 'speachiness':
      return { ...state, speachiness: action.newVal }
    case 'popularity':
      return { ...state, popularity: action.newVal }
    case 'tempo':
      return { ...state, tempo: action.newVal }
    default:
      throw new Error()
  }
}

export const Home = ({ color }) => {
  const spotifyApi = useSpotify()
  const [currentTrackId, setCurrentTrackId] =
    useRecoilState(currentTrackIdState)
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState)
  const [genres, setGenres] = useState(null)
  const [selectedGenres, setSelectedGenres] = useState(['electro'])
  const [songAttributes, dispatch] = useReducer(reducer, {
    danceability: [0, 1],
    energy: [0, 1],
    speachiness: [0, 1],
    popularity: [0, 1],
    tempo: [0, 1],
  })
  const [recommendedSongs, setRecommendedSongs] = useState([])

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

  const recommendReqConfig = {
    seed_artists: '',
    seed_tracks: '',
    seed_genres: selectedGenres.length > 0 ? selectedGenres.join() : 'electro',
    min_danceability: songAttributes.danceability[0],
    max_danceability: songAttributes.danceability[1],
    min_energy: songAttributes.energy[0],
    max_energy: songAttributes.energy[1],
    min_speechiness: songAttributes.speachiness[0],
    max_speechiness: songAttributes.speachiness[1],
    min_popularity: songAttributes.popularity[0] * 100,
    max_popularity: songAttributes.popularity[1] * 100,
    min_tempo: songAttributes.tempo[0] * 200,
    max_tempo: songAttributes.tempo[1] * 200,
    limit: 5,
  }

  const getRecommendedSongs = () => {
    spotifyApi
      .getRecommendations(recommendReqConfig)
      .then((data) => {
        setRecommendedSongs(data.body?.tracks)
      })
      .catch((err) => console.error(err))
  }

  const playSong = (song) => {
    setCurrentTrackId(song.id)
    setIsPlaying(true)
    spotifyApi
      .play({
        uris: [song?.uri],
      })
      .catch((err) => console.log(err))
  }

  console.log(selectedGenres.join())
  return (
    <div>
      <section
        className={`flex h-64 flex-col items-start justify-end bg-gradient-to-b p-8 ${color} to-black text-white`}
      >
        <div>
          <h4 className="text-2xl font-bold md:text-2xl xl:text-5xl">
            DISCOVER
          </h4>
        </div>
        <button
          className="mt-1 flex flex-row items-center justify-center rounded-full border-2 border-white bg-black p-2 hover:opacity-80"
          onClick={getRecommendedSongs}
        >
          FIND SONGS <SearchIcon className="h-5 w-5 pl-1" />
        </button>
      </section>
      {/* RECOMMENDED SONGS */}
      <div className="flex flex-row flex-wrap justify-center space-x-1 px-8 pb-4 text-white">
        {recommendedSongs?.map((recommendedSong, id) => (
          <div
            className="flex cursor-pointer flex-col hover:opacity-50"
            key={recommendedSong?.id}
            onClick={() => playSong(recommendedSong)}
          >
            <img
              className="h-44 w-44 shadow-2xl"
              src={recommendedSong?.album?.images?.[0]?.url}
              alt=""
            />
            <div>
              <p className="w-36 truncate text-white lg:w-44">
                {recommendedSong?.name}
              </p>
              <p className="w-40">{recommendedSong?.artists?.[0]?.name}</p>
            </div>
          </div>
        ))}
      </div>
      {/* CONFIGS */}
      <div className="align-center flex flex-wrap justify-center">
        {Object.entries(songAttributes)?.map((songAttribute, key) => {
          return (
            <div
              className="mr-10 h-24 w-1/4 gap-1 text-white md:w-28"
              key={key}
            >
              <p>{songAttribute?.[0]?.toUpperCase()}</p>
              <TooltipSlider
                range
                step={0.1}
                min={0}
                max={1}
                defaultValue={[0, 1]}
                tipFormatter={(value) => `${value}`}
                marks={{ 0: 0, 1: 1 }}
                onAfterChange={(data) =>
                  dispatch({ type: songAttribute[0], newVal: data })
                }
              />
            </div>
          )
        })}
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
              className={`mr-3 flex cursor-pointer items-center rounded-full bg-gradient-to-b ${color} to-black p-1 pr-2 text-white hover:opacity-50 ${
                !selectedGenres.includes(genre) && 'opacity-25'
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
