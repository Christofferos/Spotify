import { useRecoilState, useRecoilValue } from 'recoil'
import {
  centerDisplayState,
  DISPLAY_TYPE,
  showIdState,
} from '../atoms/playlistAtom'

const Show = ({ order, show }) => {
  const [, setCenterDisplay] = useRecoilState(centerDisplayState)
  const [, setShowId] = useRecoilState(showIdState)
  const selectShow = () => {
    setCenterDisplay(DISPLAY_TYPE.SAVED_EPISODES)
    setShowId(show.show.id)
  }
  return (
    <div
      className="grid cursor-pointer grid-cols-2 rounded-lg py-4 px-5 text-gray-500 hover:bg-gray-900"
      onClick={selectShow}
    >
      <div className="flex items-center space-x-4">
        <p>{order + 1}</p>
        <img className="h-10 w-10" src={show.show.images[0].url} alt="" />
        <div>
          <p className="w-36 truncate text-white lg:w-64">{show.show.name}</p>
          <p className="w-40">{show.show.publisher}</p>
        </div>
      </div>

      <div className="ml-auto flex items-center justify-between md:ml-0">
        <p className="w-50 hidden md:inline">
          {show.show.description.length > 200
            ? `${show.show.description.substring(0, 200)} ...`
            : show.show.description}
        </p>
      </div>
    </div>
  )
}

export default Show
