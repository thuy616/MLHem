require('@tensorflow/tfjs-node')
const tf = require('@tensorflow/tfjs')
const knn = require('./src/knn-tf')

const { executeGoogleGeocodingRequest } = require('./src/googleAPIClient')
const loadCSV = require('./src/load-csv')

const fullAddress = process.env.FULL_ADDRESS
const size = process.env.SIZE
const rooms = process.env.ROOMS

const runEstimate = async () => {
  const location = await executeGoogleGeocodingRequest(fullAddress)
  if (!location) {
    console.log('cannot find geocode for the address')
    process.exit(0)
  }
  const { lat, lng } = location
  const testPoint = [lat, lng, size, rooms]

  console.log({ testPoint })

  let { features, labels, testFeatures, testLabels } = loadCSV('hem.csv', {
    shuffle: true,
    dataColumns: ['lat', 'lng', 'size', 'rooms'],
    labelColumns: ['price'],
  })

  features = tf.tensor(features)
  labels = tf.tensor(labels)

  const estimatePrice = knn(features, labels, tf.tensor(testPoint), 10)
  console.log('estimatePrice: ', estimatePrice)
}

runEstimate()
