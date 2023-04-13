const Airtable = require('airtable');
const base = new Airtable({apiKey: process.env.AIRTABLE_API_KEY})
  .base(process.env.AIRTABLE_BASE_KEY);

export const table = base('coffee-stores')

export const getMinifiedRecords = (records: any) => records.map((record: any) => ({
  ... record.fields,
  recordId: record.id
}))

export const findCoffeeStoreRecord = async (id: string) => {
  const foundCoffeeRecords = await table.select({ filterByFormula: `id="${id}"`}).firstPage()
  return getMinifiedRecords(foundCoffeeRecords)
}
