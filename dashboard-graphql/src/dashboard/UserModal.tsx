import { useMutation } from "@apollo/client";
import { useState, useEffect } from "react";
import { CREATE_USER_DB, UPDATE_USER_DB } from "./mutations";
import { GET_USER_DBS } from "./queries";

interface UserModalProps {
  user: any | null;
  onClose: () => void;
  onSave: () => void;
}

const UserModal = ({ user, onClose, onSave }: UserModalProps) => {
  const [formData, setFormData] = useState({
    Name: "",
    email: "",
    phone: "",
    is_active: true,
  });
  const [error, setError] = useState("");

  const [createUserDb, { loading: createLoading }] = useMutation(CREATE_USER_DB, {
    refetchQueries: [{ query: GET_USER_DBS }],
  });

  const [updateUserDb, { loading: updateLoading }] = useMutation(UPDATE_USER_DB, {
    refetchQueries: [{ query: GET_USER_DBS }],
  });

  useEffect(() => {
    if (user) {
      setFormData({
        Name: user.Name || "",
        email: user.email || "",
        phone: user.phone || "",
        is_active: user.is_active !== undefined ? user.is_active : true,
      });
    } else {
      setFormData({
        Name: "",
        email: "",
        phone: "",
        is_active: true,
      });
    }
    setError("");
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.Name.trim() || !formData.email.trim()) {
      setError("Name and Email are required");
      return;
    }

    try {
      if (user) {
        await updateUserDb({
          variables: {
            id: user.id,
            data: formData,
          },
        });
      } else {
        await createUserDb({
          variables: {
            data: formData,
          },
        });
      }
      onSave();
    } catch (err: any) {
      console.error("Error:", err);
      setError(err?.graphQLErrors?.[0]?.message || err?.message || "Operation failed");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          padding: "30px",
          maxWidth: "500px",
          width: "90%",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ marginBottom: "20px", fontSize: "24px", fontWeight: "bold" }}>
          {user ? "Edit User" : "Add New User"}
        </h2>

        {error && (
          <div style={{ backgroundColor: "#fee", padding: "10px", marginBottom: "15px", borderRadius: "4px", color: "#c00" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Name</label>
            <input
              type="text"
              name="Name"
              value={formData.Name}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "15px" }}>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label style={{ display: "flex", alignItems: "center" }}>
              <input
                type="checkbox"
                name="is_active"
                checked={formData.is_active}
                onChange={handleChange}
                style={{ marginRight: "8px" }}
              />
              <span>Active</span>
            </label>
          </div>

          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={onClose}
              disabled={createLoading || updateLoading}
              style={{
                padding: "10px 20px",
                backgroundColor: "#ddd",
                color: "#333",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createLoading || updateLoading}
              style={{
                padding: "10px 20px",
                backgroundColor: "#2196F3",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {createLoading || updateLoading ? "Saving..." : user ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;
