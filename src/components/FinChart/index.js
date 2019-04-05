import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import gql from "graphql-tag";
import { Subscription, Mutation } from "react-apollo";
import csv from "csvtojson";
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

  return (
    <div>
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
                        Number(event.amount.replace("$", ""))
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
                        Number(event.balance.replace("$", ""))
                      )
                    }
                  ]
                }}
              />
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
                  placeholder="Paste CSV or array of JSON objects with date, amount, description..."
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
