require('@tensorflow/tfjs-node')
const tf = require('@tensorflow/tfjs')
const loadCSV = require('./src/load-csv')
const knn = require('./src/knn-tf')

let { features, labels, testFeatures, testLabels } = loadCSV('hem.csv', {
  shuffle: false,
  splitTest: 10,
  dataColumns: ['lat', 'lng', 'size', 'rooms'],
  labelColumns: ['price'],
})

features = tf.tensor(features)
labels = tf.tensor(labels)

testFeatures.forEach((testPoint, i) => {
  console.log('Analyzing...', testPoint)
  const estimatePrice = knn(features, labels, tf.tensor(testPoint), 10)
  const errPercentage = (testLabels[i][0] - estimatePrice) / testLabels[i][0] * 100
  console.log('Estimate price: ', estimatePrice, testLabels[i][0])
  console.log('Accuracy percentage', 100 - Math.abs(errPercentage))
})
