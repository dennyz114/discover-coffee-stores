import {createApi} from 'unsplash-js'

const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY
})

const getUrlForCoffeeStores = (latlong: string, query: string, limit: number) =>
  `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latlong}&limit=${limit}`

const getListOfCoffeeStorePhotos = async (limit) => {
  const response = await unsplash.search.getPhotos({
    query: "coffee shop",
    perPage: limit,
    page: 1,
  });
  return response?.response?.results?.map(r => r.urls.small)
}

export const fetchCoffeeStores = async (
  latLong = '-12.004295355976245,-77.0957868679625',
  limit = 6
) => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY
    }
  };

  const photos = await getListOfCoffeeStorePhotos(limit)
  const response = await fetch(getUrlForCoffeeStores(latLong, 'coffee', limit), options)
  const { results } = await response.json()
  // .catch(err => console.error(err));
  return results.map((r, i) => ({
    id: r.fsq_id,
    name: r.name,
    imgUrl: photos[i],
    neighbourhood: r?.location?.locality ?? '',
    address: r?.location?.address ?? '',
  }))
}
