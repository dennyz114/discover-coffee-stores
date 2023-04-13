import { useState, useContext } from 'react'
import { ACTION_TYPES, StoreContext } from '@/store/storeContext'

const useGeolocation = () => {
  const [locationErrorMsg, setLocationErrorMsg] =  useState("")
  const [isFindingLocation, setIsFindingLocation] = useState(false)
  const { dispatch } = useContext(StoreContext)

  const onGetLocation = () => {
    setIsFindingLocation(true)
    if (!navigator.geolocation) {
      setIsFindingLocation(false)
      setLocationErrorMsg("Geolocation is not supported")
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          dispatch({
            type: ACTION_TYPES.SET_LAT_LONG,
            payload: { latLong: `${latitude},${longitude}` }
          })
          setLocationErrorMsg("")
          setIsFindingLocation(false)
        },
        () => {
          setLocationErrorMsg("Unable to retreive location")
          setIsFindingLocation(false)
        }
      )
    }
  }

  return { onGetLocation, locationErrorMsg, isFindingLocation }
}

export default useGeolocation
