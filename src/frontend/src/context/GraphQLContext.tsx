import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import React from "react";

export const GraphQLProvider: React.FC = ({ children }) => {
	const client = new ApolloClient({
		uri: process.env.REACT_APP_GRAPHQL_ENDPOINT,
		cache: new InMemoryCache()
	});

	return (
		<ApolloProvider client={client}>{children}</ApolloProvider>
	);
}