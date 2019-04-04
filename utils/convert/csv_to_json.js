const csvFilePath = "./utils/input.csv";
const csv = require("csvtojson");

var fs = require("fs");
csv()
  .fromFile(csvFilePath)
  .then(jsonObj => {
    console.log(jsonObj);
    fs.writeFile(
      "./utils/output.json",
      JSON.stringify(jsonObj),
      "utf8",
      () => {}
    );
  });
