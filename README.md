## Install

Run

```
npm install
```

## Collect data

Run

```
GOOGLE_GEOCODING_API_KEY=[api_key] node src/scraper.js
```

* Scraping hemnet.se for about 5000 records of recently sold apartments
* Use cheerio to extract html data
* Use Google Geocoding API to get geocode (lat, lng) from the address of the apartments
* Write data to a csv file

## Running Analysis

Run

```
node index.js
```

This command does the following:

### Load data

* Load CSV data
* shuffle seed data
* split training set and test set

### Analysis

* Use KNN algorithm with k = 10
* Normalize data using standard deviation
* Use [tensor flow](https://www.tensorflow.org/) for high performance numerical calculation in javascript. It is the equivalent of numpy in python
* Features using for analysis: location(lat, lng) and the size (in m2) of the property

### Example results

Data point [ 59.33859529999999, 17.9293401, 47, 2 ] means the property is located at (lat: 59.33859529999999, lng: 17.9293401), has size 47m2, bedroom 2

`Analyzing... [ 59.33859529999999, 17.9293401, 47, 2 ] Estimate price: 2504500 2395000 Accuracy percentage 95.42797494780794`
`Analyzing... [ 59.4472572, 17.9612363, 114, 4 ] Estimate price: 3603000 3600000 Accuracy percentage 99.91666666666667`
`Analyzing... [ 59.2673746, 18.0116629, 90, 4 ] Estimate price: 2928500 2500000 Accuracy percentage 82.86`
`Analyzing... [ 59.29993469999999, 18.0025563, 54.5, 2 ] Estimate price: 3085000 3400000 Accuracy percentage 90.73529411764706`

## Estimate of new data point

Run

```
GOOGLE_GEOCODING_API_KEY=[api_key] FULL_ADDRESS=[full_address] SIZE=[size] ROOMS=[rooms] node estimate.js
```

Example:

```
GOOGLE_GEOCODING_API_KEY=[api_key] FULL_ADDRESS="Rämensvägen 29B, Årstastråket, Stockholm" SIZE=80 ROOMS=3 node estimate.js
```

returns estimate 4865000

```
GOOGLE_GEOCODING_API_KEY=[api_key] FULL_ADDRESS="Västgötagränd 5, 2 tr, Maria, Stockholm" SIZE=31.5 ROOMS=1.5 node estimate.js
```

returns estimate 2711000

## What's next? Improving Accuracy

* Scrape the property detailed page on hemnet for more relevant data that influences the price, e.g. the year the building is build, the floor number, etc.
* More data points, around ~50k records
* Generate trend line and predict increase or drop in the near future
