import { useQuery, useMutation } from "@apollo/client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GET_USER_DBS } from "./queries";
import { DELETE_USER_DB } from "./mutations";
import UserModal from "./UserModal";

const Dashboard = () => {
  const { data, loading, error, refetch } = useQuery(GET_USER_DBS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [deleteUserDb] = useMutation(DELETE_USER_DB);
  const navigate = useNavigate();

  if (loading) return <p>Loading user data...</p>;
  if (error) {
    console.error("Query error:", error);
    return <p>Error fetching userDb: {error.message}</p>;
  }

  const users = data?.userDbs?.data || [];

  const handleEdit = (user: any) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUserDb({ variables: { id } });
        refetch();
      } catch (err) {
        console.error("Error deleting user:", err);
        alert("Failed to delete user");
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleModalSave = () => {
    refetch();
    handleModalClose();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={{ padding: 40, maxWidth: 1200, margin: "0 auto" }}>
      <div style={{ marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>UserDB Dashboard</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handleAddNew}
            style={{
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            + Add New User
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: "10px 20px",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {users.length === 0 ? (
        <p>No users found. Click "Add New User" to create one.</p>
      ) : (
        <table border={1} cellPadding={10} style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#f2f2f2" }}>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Active</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.map((item: any) => {
              const user = item.attributes;
              return (
                <tr key={item.id}>
                  <td>{user.Name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.is_active ? "Yes" : "No"}</td>
                  <td>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "N/A"}</td>
                  <td>
                    <button
                      onClick={() => handleEdit({ id: item.id, ...user })}
                      style={{
                        marginRight: "10px",
                        padding: "5px 10px",
                        backgroundColor: "#2196F3",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      style={{
                        padding: "5px 10px",
                        backgroundColor: "#f44336",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      {isModalOpen && (
        <UserModal user={selectedUser} onClose={handleModalClose} onSave={handleModalSave} />
      )}
    </div>
  );
};

export default Dashboard;
