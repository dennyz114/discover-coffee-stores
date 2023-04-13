import { fetchCoffeeStores } from '@/lib/coffee-stores'

const getCoffeeStoresByLocation = async (req, res) => {
  const { latLong, limit } = req.query
  try {
    const response = await fetchCoffeeStores(latLong, limit)
    res.status(200).json(response)
  } catch (e) {
    res.status(500).json({ error: e.message })
  }
}

export default getCoffeeStoresByLocation
