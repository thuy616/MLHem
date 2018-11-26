require('@tensorflow/tfjs-node')
const tf = require('@tensorflow/tfjs')

const knn = (features, labels, predictionPoint, k) => {
  const { mean, variance } = tf.moments(features, 0)
  const scaledPrediction = predictionPoint.sub(mean).div(variance.pow(0.5))

  return (
    features
      .sub(mean)
      .div(variance.pow(0.5))
      .sub(scaledPrediction)
      .pow(2)
      .sum(1)
      .pow(0.5)
      .expandDims(1)
      .concat(labels, 1)
      .unstack()
      .sort((a, b) => (a.get(0) > b.get(0) ? 1 : -1))
      .slice(0, k)
      .reduce((acc, pair) => acc + pair.get(1), 0) / k
  )
}

module.exports = knn
