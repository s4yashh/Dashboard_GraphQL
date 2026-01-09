import { useQuery } from "@apollo/client";
import { GET_USER_DBS } from "./queries";

const Dashboard = () => {
  const { data, loading, error } = useQuery(GET_USER_DBS);

  if (loading) return <p>Loading user data...</p>;
  if (error) return <p>Error fetching userDb</p>;

  return (
    <div style={{ padding: 40 }}>
      <h2>UserDB Dashboard</h2>

      <table border={1} cellPadding={10}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.userDbs.map((user: any) => (
            <tr key={user.documentId}>
              <td>{user.Name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.is_active ? "Yes" : "No"}</td>
              <td>
                <button>Edit</button>
                <button>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
