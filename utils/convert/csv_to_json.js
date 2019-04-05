const csvFilePath = "./utils/convert/input.csv";
const csv = require("csvtojson");

const stringThing = `date,amount,description,balance
"January 11, 2019",$2263.87,Paycheck,$2263.87
"January 15, 2019",-$105.00,PGE/Haircut/Laundry Cash,$2158.87
"January 19, 2019",-$2200.00,Rent,-$41.13
"January 23, 2019",-$2168.00,CC Bill,-$2209.13
"January 25, 2019",$2236.01,Paycheck,$26.88
"February 3, 2019",$4600.00,SELL OFF STOCK,$4626.88
"February 4, 2019",-$4300.00,WR250R,$326.88
"February 8, 2019 12:00 AM",$2283.31,Paycheck,$2610.19
"February 15, 2019",-$105.00,PGE/Haircut/Laundry Cash,$2505.19
"February 16, 2019",$5400.00,SELL OFF AAPL 1/15 LONGS,$7905.19
"February 19, 2019",-$2200.00,Rent,$5705.19
"February 22, 2019",$2283.32,Paycheck,$7988.51
"February 23, 2019",-$4000.00,CC Bill Catchup to 0,$3988.51
"March 8, 2019 12:00 AM",$2283.33,Paycheck,$6271.84
"March 19, 2019",-$2200.00,Rent,$4071.84
"March 22, 2019",$2283.33,Paycheck,$6355.17
"March 23, 2019",-$4773.00,CC Bill + Cash withdrawals,$1582.17
"April 1, 2019",$10000.00,SELL OFF STOCK,$11582.17
"April 5, 2019",$2283.33,Paycheck,$13865.50
"April 15, 2019",-$8500.00,Taxes,$5365.50
"April 19, 2019",-$2200.00,Rent,$3165.50
"April 19, 2019",$2235.25,Paycheck,$5400.75
"May 3, 2019",$2235.25,Paycheck,$7636.00
"May 4, 2019",-$3498.00,CC Bill,$4138.00
"May 8, 2019 12:00 AM",$3000.00,SELL OFF AAPL 1/15 LONGS,$7138.00
"May 17, 2019",$2235.25,Paycheck,$9373.26
"May 19, 2019",-$2200.00,Rent,$7173.26
"May 31, 2019",$2235.25,Paycheck,$9408.51
"June 1, 2019",-$4273.00,CC Bill,$5135.51
"June 14, 2019",$2235.25,Paycheck,$7370.76
"June 19, 2019",-$2200.00,Rent,$5170.76
"June 28, 2019",$2235.25,Paycheck,$7406.01
"June 29, 2019",-$2273.00,CC Bill,$5133.01
"July 12, 2019",$2235.25,Paycheck,$7368.26
"July 19, 2019",-$2200.00,Rent,$5168.26
"July 26, 2019",$2235.25,Paycheck,$7403.51
"July 27, 2019",-$2273.00,CC Bill,$5130.51
"August 9, 2019",$2235.25,Paycheck,$7365.77
"August 19, 2019",-$2200.00,Rent,$5165.77
"August 23, 2019",$2235.25,Paycheck,$7401.02
"August 24, 2019",-$4273.00,CC Bill,$3128.02
"September 6, 2019",$2235.25,Paycheck,$5363.27
"September 19, 2019",-$2200.00,Rent,$3163.27
"September 20, 2019",$2347.01,Paycheck (+5%),$5510.28
"September 23, 2019",-$2273.00,CC Bill,$3237.28
"October 4, 2019",$8347.01,Paycheck (+5% +yr bonus 6k),$11584.30
"October 18, 2019",$2347.01,Paycheck (+5%),$13931.31
"October 19, 2019",-$2200.00,Rent,$11731.31
"October 23, 2019",-$2273.00,CC Bill,$9458.31
"November 1, 2019",$2347.01,Paycheck (+5%),$11805.33
"November 15, 2019",$2347.01,Paycheck (+5%),$14152.34
"November 19, 2019",-$2200.00,Rent,$11952.34
"November 23, 2019",-$2273.00,CC Bill,$9679.34
"November 29, 2019",$2347.01,Paycheck (+5%),$12026.35
"December 13, 2019",$2347.01,Paycheck (+5%),$14373.37
"December 19, 2019",-$2200.00,Rent,$12173.37
"December 23, 2019",-$2273.00,CC Bill,$9900.37
"December 27, 2019",$2347.01,Paycheck (+5%),$12247.38`;

var fs = require("fs");
csv()
  .fromFile(csvFilePath)
  .then(jsonObj => {
    const data = jsonObj.map(item => ({
      ...item,
      date: (+new Date(item.date)).toString()
    }));
    console.log(data);
    fs.writeFile(
      "./utils/convert/output.json",
      JSON.stringify(data),
      "utf8",
      () => {}
    );
  });
