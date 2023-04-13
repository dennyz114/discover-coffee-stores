import { findCoffeeStoreRecord } from '@/lib/airtable'

const getCoffeeStoreById = async (req, res) => {
  const { id } = req.query
  try {
    if (id) {
      const records = await findCoffeeStoreRecord(id)
      if (records.length > 0) {
        res.json({ coffeeStore: records[0] })
      } else {
        res.json({ message: 'could not find coffee store' })
      }
    } else {
      res.status(400)
      res.json({ message: 'id is required' })
    }
  } catch (e) {
    console.error("error getting store", e)
    res.status(500)
    res.json({ message: 'error getting store' })
  }
}

export default getCoffeeStoreById
