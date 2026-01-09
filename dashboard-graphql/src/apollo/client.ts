import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from "@apollo/client";

/**
 * HTTP link to Strapi GraphQL endpoint
 */
const httpLink = new HttpLink({
  uri: "http://13.200.172.225:1337/graphql",
  credentials: "omit",
});

/**
 * Auth middleware
 * IMPORTANT:
 * - DO NOT send authorization header if token does not exist
 * - Never send empty authorization header
 */
const authLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem("token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.authorization = `Bearer ${token}`;
  }

  operation.setContext({
    headers,
  });

  return forward(operation);
});

/**
 * Apollo Client instance
 */
export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
  