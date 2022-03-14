import { useEffect, useState } from 'react'
import { useSpotify } from '../hooks/useSpotify'

export const Library = () => {
  const spotifyApi = useSpotify()
  const [recentlyPlayed, setRecentlyPlayed] = useState([])
  const [topTracks, setTopTracks] = useState([])
  const [featuredPlaylists, setFeaturedPlaylists] = useState([])

  useEffect(() => {
    spotifyApi
      .getMyRecentlyPlayedTracks({ limit: 5 })
      .then((data) => {
        const recentTracks = data.body?.items
        setRecentlyPlayed(recentTracks)
      })
      .catch((err) => console.error(err))
    spotifyApi
      .getMyTopTracks({ limit: 5 })
      .then((data) => {
        const tracks = data.body?.items
        setTopTracks(tracks)
      })
      .catch((error) => console.log(error))
    spotifyApi
      .getFeaturedPlaylists({ limit: 5 })
      .then((data) => {
        const playlists = data.body?.playlists?.items
        setFeaturedPlaylists(playlists)
      })
      .catch((error) => console.log(error))
  }, [])

  return (
    <>
      <h4 className="md:text-2l xl:text-5l p-5 text-4xl font-bold text-white">
        LIBRARY
      </h4>
      <div className="p-10 pt-40">
        <h4 className="md:text-2l xl:text-5l text-2xl font-bold text-white">
          RECENTLY PLAYED
        </h4>
        <div className="flex flex-row space-x-3">
          {recentlyPlayed?.map((recentTrack) => {
            const track = recentTrack?.track
            return (
              <div className="w-36" key={track?.id}>
                <img src={track?.album?.images?.[0]?.url} alt="" />
                <p className="text-xl text-white">{track?.name}</p>
                <p className="text-white">{track?.artists?.[0]?.name}</p>
              </div>
            )
          })}
        </div>
        <h4 className="md:text-2l xl:text-5l text-2xl font-bold text-white">
          TOP TRACKS
        </h4>
        <div className="flex flex-row space-x-3">
          {topTracks?.map((topTrack) => {
            return (
              <div className="w-36" key={topTrack?.id}>
                <img src={topTrack?.album?.images?.[0]?.url} alt="" />
                <p className="text-xl text-white">{topTrack?.name}</p>
                <p className="text-white">{topTrack?.artists?.[0]?.name}</p>
              </div>
            )
          })}
        </div>
        <h4 className="md:text-2l xl:text-5l text-2xl font-bold text-white">
          FEATURED PLAYLISTS
        </h4>
        <div className="flex flex-row space-x-3">
          {featuredPlaylists?.map((playlist) => {
            return (
              <div className="w-36" key={playlist?.id}>
                <img src={playlist?.images?.[0]?.url} alt="" />
                <p className="text-xl text-white">{playlist?.name}</p>
                <p className="text-white">{playlist?.owner?.display_name}</p>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}
