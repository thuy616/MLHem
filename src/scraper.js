const request = require('request')
const cheerio = require('cheerio')
const createCsvWriter = require('csv-writer').createObjectCsvWriter

const { HEMNET_URL } = require('../config')
const { executeGoogleGeocodingRequest } = require('./googleAPIClient')

const csvWriter = createCsvWriter({
  path: './hem.csv',
  header: [
    { id: 'addressLine1', title: 'addressLine1' },
    { id: 'addressLine2', title: 'addressLine2' },
    { id: 'size', title: 'size' },
    { id: 'rooms', title: 'rooms' },
    { id: 'fee', title: 'fee' },
    { id: 'price', title: 'price' },
    { id: 'soldDate', title: 'soldDate' },
    { id: 'lat', title: 'lat' },
    { id: 'lng', title: 'lng' },
  ],
  fieldDelimiter: ';', // use semicolon because colons are present in address string
})

const { MONTHS } = require('./constants')

const MAX_PAGE = 200

const executeRequest = page => {
  request({ url: `${HEMNET_URL}${page}` }, async (error, response, body) => {
    if (error) {
      console.error(error)
    }

    const $ = cheerio.load(body, {
      normalizeWhitespace: true,
    })

    const addressesLine1 = $('.item-result-meta-attribute-is-bold')
    const addressesLine2 = $('.sold-property-listing__location')
    const sizes = $('.sold-property-listing__size')
    const fees = $('.sold-property-listing__fee')
    const prices = $('.sold-property-listing__price')
    const soldDates = $('.sold-property-listing__sold-date')

    const records = []

    for (let i = 0; i < addressesLine1.length; i++) {
      const addressLine1 = addressesLine1[i].children[0].data
      const area = addressesLine2[i].children[3].children[3]
        ? addressesLine2[i].children[3].children[3].children[0].data.trim()
        : ''
      const city = addressesLine2[i].children[3].children[4]
        ? addressesLine2[i].children[3].children[4].data.trim()
        : addressesLine2[i].children[3].children[2].data.trim()
      const addressLine2 = `${area} ${city}`

      const sizeElems = sizes[i].children[1].children[1].children[0].data.trim().split('\n')
      const size = Number(
        sizeElems[0]
          .trim()
          .replace(',', '.')
          .replace(' m²', '')
          .split(/\s{1}/)[0]
      )

      const rooms = Number(
        sizeElems[2]
          .trim()
          .replace(',', '.')
          .split(/\s{1}/)[0]
      )

      const fee = Number(
        fees[i].children[0].data
          .trim()
          .replace(/\s{1}kr\/mån/, '')
          .replace(/\s+/g, '')
      )

      const price = Number(
        prices[i].children[1].children[1].children[0].data
          .trim()
          .replace('Slutpris ', '')
          .replace(' kr', '')
          .replace(/\s+/g, '')
      )

      const soldDateElems = soldDates[0].children[0].data.trim().split(' ')
      const soldDate = new Date(
        soldDateElems[3],
        MONTHS[soldDateElems[2]],
        soldDateElems[1]
      ).toISOString()

      const location = await executeGoogleGeocodingRequest(`${addressLine1}, ${addressLine2}`)
      records.push({
        addressLine1,
        addressLine2,
        size,
        rooms,
        fee,
        price,
        soldDate,
        ...location,
      })
    }

    await csvWriter.writeRecords(records)
  })
}

const delay = () => {
  return new Promise(resolve => setTimeout(resolve, 5000))
}

const execute = async () => {
  for (let page = 1; page < MAX_PAGE; page++) {
    console.log(`******** PROCESSING PAGE = ${page} ********`)
    await executeRequest(1)
    // add delay so that hemnet will not block request
    if (page !== MAX_PAGE - 1) await delay()
  }
  console.log('======= DONE =======')
}

execute()
