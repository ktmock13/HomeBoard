const csv = require('csv-parser')
const fs = require('fs')
const results = [];
 
fs.createReadStream('utils/input.csv')
  .pipe(csv())
  .on('data', results.push)
  .on('end', () => {
    console.log(results);
  });