import { gql, useQuery } from "@apollo/client";

const TEST_QUERY = gql`
  query {
    __typename
  }
`;

function App() {
  const { loading, error } = useQuery(TEST_QUERY);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return <h1>GraphQL Connected Successfully</h1>;
}

export default App;
