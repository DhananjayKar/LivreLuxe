import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import ConfirmModal from "../ConfirmModel/ConfirmModal";

const UserPanel = ({ refreshCounts }) => {
  const [users, setUsers] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const API = import.meta.env.VITE_API_URL;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/api/users`);
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      toast.error("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [API]);

  const toggleExpand = (id) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const makeAdmin = async (id) => {
    try {
      await fetch(`${API}/api/users/${id}/promote`, { method: "PUT" });
      toast.success("User promoted to admin!");
      setUsers((prev) =>
        prev.map((u) => (u._id === id ? { ...u, role: "admin" } : u))
      );
      if (refreshCounts) refreshCounts();
    } catch (err) {
      toast.error("Failed to promote user");
    }
  };

  const confirmDelete = (user) => {
    setUserToDelete(user);
    setShowConfirm(true);
  };

  const handleConfirmedDelete = async () => {
    try {
      await fetch(`${API}/api/users/${userToDelete._id}`, { method: "DELETE" });
      toast.success("User deleted successfully");
      setUsers((prev) => prev.filter((u) => u._id !== userToDelete._id));
      if (refreshCounts) refreshCounts();
    } catch (err) {
      toast.error("Failed to delete user");
    }
    setShowConfirm(false);
    setUserToDelete(null);
  };

  return (
    <div className="bg-gray-50 p-4 rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-4">👥 All Users</h2>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user._id}
              className="bg-white p-4 rounded-lg shadow transition"
            >
              <div
                onClick={() => toggleExpand(user._id)}
                className="cursor-pointer flex justify-between items-center"
              >
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  {user.name}
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      user.role === "admin"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {user.role.toUpperCase()}
                  </span>
                </h3>
                <span className="text-sm text-blue-500">
                  {expandedId === user._id ? "▲ Hide" : "▼ Details"}
                </span>
              </div>

              {expandedId === user._id && (
                <div className="mt-4 text-sm text-gray-700 space-y-2">
                  <p>
                    <strong>Email:</strong> {user.email}
                  </p>
                  <p>
                    <strong>Created At:</strong>{" "}
                    {new Date(user.createdAt).toLocaleString()}
                  </p>
                  <p>
                    <strong>Role:</strong> {user.role}
                  </p>

                  <div className="flex gap-3 mt-3">
                    {user.role !== "admin" && (
                      <>
                        <button
                          onClick={() => makeAdmin(user._id)}
                          className="px-3 py-1 bg-green-600 text-white rounded transition transform hover:scale-110 hover:bg-green-700"
                        >
                          👑 Make Admin
                        </button>
                        <button
                          onClick={() => confirmDelete(user)}
                          className="px-3 py-1 bg-red-600 text-white rounded transition transform hover:scale-110 hover:bg-red-700"
                        >
                          🗑️ Delete User
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showConfirm && userToDelete && (
        <ConfirmModal
          title="Delete User"
          message={`Are you sure you want to delete "${userToDelete.name}"?`}
          onConfirm={handleConfirmedDelete}
          onCancel={() => {
            setShowConfirm(false);
            setUserToDelete(null);
          }}
        />
      )}
    </div>
  );
};

export default UserPanel;