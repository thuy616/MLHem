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

## Estimate of new data point

Run

```
GOOGLE_GEOCODING_API_KEY=[api_key] FULL_ADDRESS=[full_address] SIZE=[size] ROOMS=[rooms] node estimate.js
```

Example:

```
GOOGLE_GEOCODING_API_KEY=[api_key] FULL_ADDRESS="Rämensvägen 29B, Årstastråket, Stockholm" SIZE=80 ROOMS=3 node estimate.js
```
