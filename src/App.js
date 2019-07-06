import React, { Component } from 'react'
import { ApolloProvider } from "react-apollo";
import client from "./apolloclient";

export default class App extends Component {
  render() {
    return (
     <ApolloProvider client={client}>
       <p>1</p>
     </ApolloProvider>
    )
  }
}
