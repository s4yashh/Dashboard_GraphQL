import { gql, useMutation } from "@apollo/client";
import { useState } from "react";

const LOGIN_MUTATION = gql`
  mutation Login($identifier: String!, $password: String!) {
    login(
      input: {
        identifier: $identifier
        password: $password
      }
    ) {
      jwt
      user {
        id
        username
        email
      }
    }
  }
`;

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const [login, { loading, error }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      localStorage.setItem("token", data.login.jwt);
      window.location.href = "/dashboard";
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    login({
      variables: {
        identifier,
        password,
      },
    });
  };

  return (
    <div style={{ padding: 40, maxWidth: 400, margin: "auto" }}>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          required
          style={{ width: "100%", padding: 8 }}
        />

        <br /><br />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", padding: 8 }}
        />

        <br /><br />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        {error && (
          <pre style={{ color: "red" }}>
            {JSON.stringify(error.graphQLErrors, null, 2)}
          </pre>
        )}
      </form>
    </div>
  );
};

export default Login;
