import React, { Component } from "react";
import gql from "graphql-tag";
import ApolloClient from "apollo-client";
import { ApolloProvider, Subscription } from "react-apollo";
import { WebSocketLink } from "apollo-link-ws";
import { HttpLink } from "apollo-link-http";
import { split } from "apollo-link";
import { getMainDefinition } from "apollo-utilities";
import { InMemoryCache } from "apollo-cache-inmemory";

const httpLink = new HttpLink({
  uri: "https://homeboard-hasura.herokuapp.com/v1alpha1/graphql"
});

// Create a WebSocket link:
const wsLink = new WebSocketLink({
  uri: "ws://homeboard-hasura.herokuapp.com/v1alpha1/graphql",
  options: {
    reconnect: true
  }
});

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === "OperationDefinition" && operation === "subscription";
  },
  wsLink,
  httpLink
);

// Instantiate client
const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

const DATA_SUBSCRIPTION = gql`
  subscription onUpdatedData {
    profile {
      id
      name
    }
  }
`;
class App extends Component {
  render() {
    return (
      <ApolloProvider client={client}>
        <div className="App">
          <Subscription subscription={DATA_SUBSCRIPTION}>
            {({ data, loading }) => (
              <h4>New comment: {JSON.stringify(data)}</h4>
            )}
          </Subscription>
        </div>
      </ApolloProvider>
    );
  }
}

export default App;
