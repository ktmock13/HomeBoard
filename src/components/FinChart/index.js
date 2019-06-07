import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import "chartjs-plugin-datalabels";
import gql from "graphql-tag";
import { Subscription, Mutation } from "react-apollo";
import csv from "csvtojson";
import numeral from "numeral";
import moment from "moment";

import "./styles.scss";

export function FinChart() {
  const SUBSCRIPTION = gql`
    subscription onFinEvent {
      bulkStore(limit: 1, order_by: { dateUpdated: desc }) {
        data
      }
    }
  `;

  const MUTATION = gql`
    mutation addBulkStore($objects: [bulkStore_insert_input!]!) {
      insert_bulkStore(objects: $objects) {
        returning {
          id
        }
      }
    }
  `;

  const [mutatePanel, setMutatePanel] = useState(false);
  const [exportType, setExportType] = useState("CSV");

  const onRadioChange = el => setExportType(el.target.value);
  const parseCSV = str =>
    csv()
      .fromString(str)
      .then(jsonObj => {
        const data = jsonObj.map(item => ({
          ...item,
          date: (+new Date(item.date)).toString()
        }));
        return data;
      });

  const autoDetectJSON = el => {
    try {
      JSON.parse(el.target.value);
    } catch (err) {
      console.log("invalid json");
      setExportType("CSV");
      return false;
    }
    console.log("valid json");
    setExportType("JSON");
    return true;
  };

  const sumbitData = async (value, callback) => {
    let data;
    if (exportType === "JSON") {
      data = JSON.parse(value);
    } else {
      data = await parseCSV(value);
    }

    await callback({
      variables: {
        objects: [
          {
            app: "finEvents",
            data: data,
            dateUpdated: `${+Date.now()}`
          }
        ]
      }
    });
  };

  const valuesForLineBar = (lineVal, barVal) => ({ dataset }) => {
    return dataset && dataset.type === "line"
      ? lineVal
      : barVal
    };



    const getRevealWidth = (finEvents = []) => {
      const today = moment();
      const dates = finEvents.map(e => moment(Number(e.date)));
      console.log(dates);

      // return moment.duration(today.diff(curr)).asHours() 
      
      // moment.duration(today.diff(prev)).asHours() 


      let closest = dates.reduce((acc, curr, i) => {

        // if the days between today and the current value are less than the accumulator, then set the accumulator to current
        const timeBetweenAcc = Math.abs(moment.duration(today.diff(dates[acc])).asDays());
        const timeBetweenCurr = Math.abs(moment.duration(today.diff(dates[i])).asDays());

        return (timeBetweenAcc < timeBetweenCurr) ? acc : i;
      }, 0);

      return `${(1 - ((closest+1)/finEvents.length)) * 100}%`;
    }

  return (
    <div class="root">
      <button
        className="mutate-panel-btn"
        onClick={() => setMutatePanel(!mutatePanel)}
      >
        Panel
      </button>
      {!mutatePanel ? (
        <Subscription subscription={SUBSCRIPTION}>
          {({ data, loading }) => {
            let finEvents = loading ? [] : data.bulkStore[0].data;
            return (
              <div class="chart-display">
                {loading && <div className="loader">Loading... </div>}
                <div className='reveal' style={{
                  width: getRevealWidth(finEvents)
                }} />
                <Bar
                  data={{
                    labels: finEvents.map(event => event.date),
                    datasets: [
                      {
                        backgroundColor: context =>
                          context.dataset.data[context.dataIndex] < 0
                            ? "red"
                            : "#7ED321",
                        data: finEvents.map(event =>
                          Number(event.amount.replace("$", ""))
                        )
                      },
                      {
                        borderColor: "#4A90E2",
                        borderWidth: 2,
                        type: "line",
                        borderJoinStyle: "round",
                        borderCapStyle: "round",
                        lineTension: 0.1,
                        pointRadius: 0,
                        fill: false,
                        data: finEvents.map(event =>
                          Number(event.balance.replace("$", ""))
                        )
                      }
                    ]
                  }}
                  options={{
                    layout: {
                      padding: {
                        top: 100,
                        bottom: 100
                      }
                    },
                    plugins: {
                      // Change options for ALL labels of THIS CHART
                      datalabels: {
                        align: valuesForLineBar("top", "middle"),
                        font: {
                          size: 7,
                          weight: 700
                        },
                        color: valuesForLineBar('silver', 'black'),
                        display: valuesForLineBar(false, true),
                        clamp: true,
                        rotation: valuesForLineBar(-90, -90),
                        formatter: (value, context) =>
                          numeral(value).format("0.0 a")
                      }
                    },
                    tooltips: {
                      enabled: false
                    },
                    legend: {
                      display: false
                    },
                    scales: {
                      yAxes: [
                        {
                          display: false
                        }
                      ],
                      xAxes: [
                        {
                          barThickness: 8,
                          ticks: {
                            callback: function(value, index, values) {
                              return `${finEvents[index].desc} - ${moment(Number(value)).format("MMM Do")}`;
                            },
                            maxRotation: 90,
                            minRotation: 90,
                            autoSkip: false,
                            fontColor: '#444',
                            fontSize: 10
                          }
                        }
                      ]
                    }
                  }}
                />
              </div>
            );
          }}
        </Subscription>
      ) : (
        <Mutation mutation={MUTATION}>
          {(insert_bulkStore, { data }) => (
            <div>
              <form
                onSubmit={e => {
                  e.preventDefault();
                  const value = e.target.textbox.value;
                  sumbitData(value, insert_bulkStore);
                  setMutatePanel(false);
                }}
              >
                <textarea
                  className="mutate-textarea"
                  id="texbox"
                  name="textbox"
                  onChange={autoDetectJSON}
                  placeholder="Paste CSV or array of JSON objects with (date, amount, desc, balance) columns"
                />
                <div className="mutate-form-btns">
                  <label>
                    <input
                      onChange={onRadioChange}
                      type="radio"
                      value="CSV"
                      checked={exportType === "CSV"}
                    />
                    CSV
                  </label>
                  <label>
                    <input
                      onChange={onRadioChange}
                      type="radio"
                      value="JSON"
                      checked={exportType === "JSON"}
                    />
                    JSON
                  </label>

                  <button className="mutate-submit" type="submit">
                    Submit
                  </button>
                </div>
              </form>
            </div>
          )}
        </Mutation>
      )}
    </div>
  );
}

/*

          
*/
