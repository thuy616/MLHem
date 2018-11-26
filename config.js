const GOOGLE_GEOCODING_API_KEY = process.env.GOOGLE_GEOCODING_API_KEY

const HEMNET_URL =
  'https://www.hemnet.se/salda/bostader?item_types%5B%5D=bostadsratt&location_ids%5B%5D=17744&page='
const GOOGLE_GEOCODING_API_URL = `https://maps.googleapis.com/maps/api/geocode/json?key=${GOOGLE_GEOCODING_API_KEY}&address=`

module.exports = { HEMNET_URL, GOOGLE_GEOCODING_API_URL }
