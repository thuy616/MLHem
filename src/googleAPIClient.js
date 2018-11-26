const rp = require('request-promise')
const { GOOGLE_GEOCODING_API_URL } = require('../config')

const executeGoogleGeocodingRequest = fullAddress => {
  const encodedAddress = encodeURI(fullAddress).replace(/%20/g, '+')
  return rp({ uri: `${GOOGLE_GEOCODING_API_URL}${encodedAddress}`, json: true })
    .then(response => {
      if (response.error_message) {
        console.error('GOOGLE_GEOCODING_API_ERROR', response.error_message)
      }

      return response.results[0] ? response.results[0].geometry.location : { lat: null, lng: null }
    })
    .catch(error => {
      console.error('GOOGLE_GEOCODING_API_ERROR', error)
      return { lat: null, lng: null }
    })
}

module.exports = { executeGoogleGeocodingRequest }
