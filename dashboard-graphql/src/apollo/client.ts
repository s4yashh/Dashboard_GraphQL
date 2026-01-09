import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';
import { getToken } from '../utils/token';

const httpLink = new HttpLink({
  uri: import.meta.env.VITE_GRAPHQL_ENDPOINT || 'http://13.200.172.225:1337/graphql',
  credentials: 'include',
});

const authLink = new ApolloLink((operation, forward) => {
  const token = getToken();
  
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
  });

  return forward(operation);
});

export const apolloClient = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});
