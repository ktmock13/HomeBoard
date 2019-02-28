import React, { Component } from 'react';
import ApolloClient from 'apollo-boost'
import { ApolloProvider, Query } from 'react-apollo'
import gql from 'graphql-tag'
import './App.css';

const client = new ApolloClient({
  uri: 'http://localhost:4000/graphql',
})

class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div className="App">
          <Query
            query={gql`
              {finEvents {
    id
    desc
    datetime
    amount
  }}
            `}
          >
            {({ loading, error, data }) => {
              if (loading) return <p>Good things take time....</p>
              if (error) return <p>Something went wrong...</p>
              return (
                <div className="row">
                  {
                    data.finEvents.map(finEvent => {
                      return <p> {JSON.stringify(finEvent)} </p>;
                    })
                  }
                </div>
              );

            }
            }
          </Query>

        </div>
      </ApolloProvider>
    );
  }
}

export default App;
