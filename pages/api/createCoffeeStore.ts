import { findCoffeeStoreRecord, getMinifiedRecords, table } from '@/lib/airtable'

const createCoffeeStore = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { id, name, address, neighbourhood, imgUrl, voting } = req.body
      if (id) {
        const records = await findCoffeeStoreRecord(id)
        if (records.length > 0) {
          res.json({ coffeeStore: records[0] })
        } else {
          if (name) {
            const createCoffeeStoreResponse = await table.create([
              { fields: { id, name, address, neighbourhood, imgUrl, voting } }
            ])
            const createdCoffeeStore =  getMinifiedRecords(createCoffeeStoreResponse)
            res.json({ coffeeStore: createdCoffeeStore[0] })
          } else {
            res.status(400)
            res.json({ message: 'name is missing' })
          }
        }
      } else {
        res.status(400)
        res.json({ message: 'id is required' })
      }
    } catch (e) {
      console.error("error creating or finding store", e)
      res.status(500)
      res.json({ message: 'error creating or finding store' })
    }
  } else {
    res.json({ message: 'invalid method' })
  }
}

export default createCoffeeStore
