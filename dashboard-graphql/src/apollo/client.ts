import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from "@apollo/client";

const httpLink = new HttpLink({
  uri: "http://13.200.172.225:1337/graphql",
  credentials: "omit", // Changed from "include" to "omit" to avoid CORS issues
});

const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem("token");

  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : "",
      "Content-Type": "application/json",
    },
  });

  return forward(operation);
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
