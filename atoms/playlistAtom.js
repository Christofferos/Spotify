import { atom } from 'recoil'

export const playlistState = atom({
  key: 'playlistState',
  default: null,
})

export const playlistIdState = atom({
  key: 'playlistIdState',
  default: '429MNYwyKHyV6wHimYtIAv',
})

export const showsState = atom({
  key: 'showsState',
  default: null,
})

export const showIdState = atom({
  key: 'showIdState',
  default: null,
})

export const episodesState = atom({
  key: 'episodesState',
  default: null,
})

export const songAnalyticsState = atom({
  key: 'songAnalyticsState',
  default: null,
})

export const DISPLAY_TYPE = {
  PLAYLIST: 'PLAYLIST',
  SAVED_TRACKS: 'SAVED_TRACKS',
  SAVED_EPISODES: 'SAVED_EPISODES',
  SAVED_SHOWS: 'SAVED_SHOWS',
  HOME: 'HOME',
  SEARCH: 'SEARCH',
}

export const centerDisplayState = atom({
  key: 'centerDisplayState',
  default: DISPLAY_TYPE.PLAYLIST,
})
