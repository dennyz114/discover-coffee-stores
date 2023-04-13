import { findCoffeeStoreRecord, getMinifiedRecords, table } from '@/lib/airtable'

const favoriteCoffeeStoreById = async (req, res) => {
  if (req.method === 'PUT') {
    const {id} = req.body
    try {
      if (id) {
        const records = await findCoffeeStoreRecord(id)
        if (records.length > 0) {
          const record = records[0]
          const updatedCoffeeStore = await table.update([
            { id: record.recordId, fields: { voting: record.voting + 1 } }
          ])
          res.json({ coffeeStore: getMinifiedRecords(updatedCoffeeStore)[0] })
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
}

export default favoriteCoffeeStoreById
