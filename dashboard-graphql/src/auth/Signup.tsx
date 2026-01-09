import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const SIGNUP_MUTATION = gql`
  mutation Register($username: String!, $email: String!, $password: String!) {
    register(input: { username: $username, email: $email, password: $password }) {
      jwt
      user {
        id
        username
        email
      }
    }
  }
`;

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [signup, { loading }] = useMutation(SIGNUP_MUTATION, {
    onCompleted: (data) => {
      localStorage.setItem("token", data.register.jwt);
      navigate("/dashboard");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    signup({
      variables: {
        username,
        email,
        password,
      },
    }).catch((err) => {
      setError(err.graphQLErrors?.[0]?.message || "Signup failed");
    });
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f5f5f5" }}>
      <div style={{ maxWidth: 400, width: "100%", padding: 40, backgroundColor: "white", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        <h2 style={{ textAlign: "center", marginBottom: 30, fontSize: "28px", fontWeight: "bold" }}>Sign Up</h2>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 15 }}>
            <label style={{ display: "block", marginBottom: 5, fontWeight: "500" }}>Username</label>
            <input
              type="text"
              placeholder="Enter username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
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

          <div style={{ marginBottom: 15 }}>
            <label style={{ display: "block", marginBottom: 5, fontWeight: "500" }}>Email</label>
            <input
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

          <div style={{ marginBottom: 15 }}>
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

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", marginBottom: 5, fontWeight: "500" }}>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              fontWeight: "500",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>

          {error && (
            <div style={{ marginTop: 15, padding: 12, backgroundColor: "#ffebee", borderRadius: "4px", color: "#c62828" }}>
              <p style={{ margin: 0, fontSize: "14px" }}>{error}</p>
            </div>
          )}
        </form>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: "14px", color: "#666" }}>
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#2196F3", textDecoration: "none", fontWeight: "500" }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
