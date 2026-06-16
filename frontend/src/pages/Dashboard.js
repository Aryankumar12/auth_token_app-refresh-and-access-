import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";
import Spinner from "../components/Spinner";

function Dashboard() {

  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);

        const { data } = await API.get("/auth/users");
        setUsers(data);

      } catch (err) {
        navigate("/");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  // Logout
  const handleLogout = () => {
    
    navigate("/");
  };

  // Delete User
  const handleDelete = async (id) => {
    try {
      await API.delete(`/auth/users/${id}`);

      toast.success("User deleted successfully 🗑️");

      setUsers((prevUsers) =>
        prevUsers.filter((u) => u._id !== id)
      );

    } catch (err) {
      toast.error(
        err.response?.data?.message ||
        "Failed to delete user"
      );
    }
  };

  // Full Page Loader
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white p-8 transition-colors duration-300">

      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">
            Admin Dashboard
          </h2>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            Logout
          </button>
        </div>

        {/* User Grid */}
        {users.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">

            {users.map((u) => (
              <div
                key={u._id}
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-xl transition duration-300"
              >
                <h3 className="text-xl font-semibold">
                  {u.name}
                </h3>

                <p className="text-gray-500 dark:text-gray-300 mb-4">
                  {u.email}
                </p>

                <button
                  onClick={() => handleDelete(u._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition"
                >
                  Delete User
                </button>
              </div>
            ))}

          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow text-center">
            No users found.
          </div>
        )}

      </div>

    </div>
  );
}

export default Dashboard;