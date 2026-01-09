import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

  const [login, { loading, error }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      localStorage.setItem("token", data.login.jwt);
      navigate("/dashboard");
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
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f5f5f5" }}>
      <div style={{ maxWidth: 400, width: "100%", padding: 40, backgroundColor: "white", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        <h2 style={{ textAlign: "center", marginBottom: 30, fontSize: "28px", fontWeight: "bold" }}>Login</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 15 }}>
            <label style={{ display: "block", marginBottom: 5, fontWeight: "500" }}>Username or Email</label>
            <input
              type="text"
              placeholder="Enter username or email"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", marginBottom: 5, fontWeight: "500" }}>Password</label>
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "10px 12px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "12px",
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              fontWeight: "500",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {error && (
            <div style={{ marginTop: 15, padding: 12, backgroundColor: "#ffebee", borderRadius: "4px", color: "#c62828" }}>
              <p style={{ margin: 0, fontSize: "14px" }}>
                {error.graphQLErrors?.[0]?.message || error.message || "Failed to connect to server. Check your internet connection and try again."}
              </p>
            </div>
          )}
        </form>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: "14px", color: "#666" }}>
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: "#2196F3", textDecoration: "none", fontWeight: "500" }}>
            Sign up
          </Link>
        </p>

        <div style={{ marginTop: 20, padding: 12, backgroundColor: "#e3f2fd", borderRadius: "4px", fontSize: "12px", color: "#1565c0" }}>
          <p style={{ margin: "0 0 8px 0", fontWeight: "bold" }}>Test Credentials:</p>
          <p style={{ margin: "4px 0" }}>Username: testuser</p>
          <p style={{ margin: "4px 0" }}>Password: 1234567989</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
