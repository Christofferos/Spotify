import { atom } from 'recoil'
import { DISPLAY_TYPE } from '../components/Center'

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

export const centerDisplayState = atom({
  key: 'centerDisplayState',
  default: DISPLAY_TYPE.PLAYLIST,
})
