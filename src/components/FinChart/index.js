import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";

import "./FinChart.scss";

let poll;

export function FinChart() {
  const [finEvents, setFinEvents] = useState([]);

  const fetchData = async () => {
    const response = await fetch("http://localhost:4444/finEvents");
    const data = await response.json();
    setFinEvents(data);
  };

  const writeData = async () => {
    await fetch("http://localhost:4444/finEvents", {
      method: "POST",
      body: JSON.stringify({
        id: +new Date(),
        date: "March 23, 2019",
        amount: "-$4773.00",
        desc: "CC Bill + Cash withdrawals",
        balance: "$1582.17"
      }),
      headers: {
        "Content-Type": "application/json"
      }
    });
    // await fetchData();
  };

  useEffect(() => {
    fetchData();
    if (!poll) poll = setInterval(() => fetchData(), 5000);
  }, []);

  return (
    <div>
      <button onClick={() => writeData()}> Update </button>
      <Bar
        data={{
          labels: finEvents.map(event => event.date),
          datasets: [
            {
              label: "+ Amounts",
              backgroundColor: context =>
                context.dataset.data[context.dataIndex] < 0
                  ? "red"
                  : "lightGreen",
              data: finEvents.map(event =>
                parseInt(event.amount.replace("$", ""))
              )
            },
            {
              label: "Balance",
              backgroundColor: "lightBlue",
              borderColor: "lightBlue",
              type: "line",
              borderJoinStyle: "round",
              borderCapStyle: "round",
              lineTension: 0,
              fill: false,
              data: finEvents.map(event =>
                parseInt(event.balance.replace("$", ""))
              )
            }
          ]
        }}
      />
    </div>
  );
}
