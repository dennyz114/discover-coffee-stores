import { createContext, useReducer } from 'react'

export const StoreContext = createContext({
  dispatch: (param: any) => {},
})

export enum ACTION_TYPES {
  SET_LAT_LONG,
  SET_COFFEE_STORES
}

const storeReducer = (state, action) => {
  switch(action.type) {
    case ACTION_TYPES.SET_LAT_LONG:
      return {... state, latLong: action.payload.latLong}
    case ACTION_TYPES.SET_COFFEE_STORES:
      return {... state, nearbyStores: action.payload.nearbyStores}
    default:
      throw Error(`${action.type} is not defined`)
  }
}

const StoreProvider = ({children}) => {
  const initialState = {
    latLong: '',
    nearbyStores: []
  }
  const [state, dispatch] = useReducer(storeReducer, initialState)

  return (
    <StoreContext.Provider value={{state, dispatch}}>
      {children}
    </StoreContext.Provider>
  )
}

export default StoreProvider
