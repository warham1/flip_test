import React, { Component } from 'react'
import { ApolloProvider } from "react-apollo";
import { ApolloProvider as ApolloHooksProvider} from "react-apollo-hooks";
import client from "./apolloclient";
import View from "./View";
import Head from "./Head";
import "./App.css";

export default class App extends Component {
  render() {
    return (
     <ApolloProvider client={client}>
       <ApolloHooksProvider client = {client}>
        <Head/>
        <View/>
       </ApolloHooksProvider>
     </ApolloProvider>
    )
  }
}
