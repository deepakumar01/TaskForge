// src/pages/Team.jsx
// Team management page (admin only) to view all users

import { useState, useEffect } from "react";
import API from "../api/axios";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";
import {
  HiOutlineSearch,
  HiOutlineMail,
  HiOutlineShieldCheck,
  HiOutlineUser,
} from "react-icons/hi";

const Team = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Fetch all users on mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await API.get("/auth/users");
      setUsers(response.data.data);
    } catch (error) {
      toast.error("Failed to load team members");
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return <LoadingSpinner size="lg" text="Loading team..." />;
  }

  return (
    <div className="animate-fade-in">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1
            className="text-2xl font-bold"
            style={{ color: "var(--color-text-primary)" }}
          >
            Team Members
          </h1>
          <p
            className="text-sm mt-1"
            style={{ color: "var(--color-text-secondary)" }}
          >
            {users.length} total members
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md mb-6">
        <HiOutlineSearch
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
          style={{ color: "var(--color-text-muted)" }}
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
          style={{
            backgroundColor: "var(--color-bg-secondary)",
            borderColor: "var(--color-border)",
            color: "var(--color-text-primary)",
          }}
        />
      </div>

      {/* Users grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUsers.map((user) => (
          <div
            key={user._id}
            className="rounded-xl p-5 border transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5"
            style={{
              backgroundColor: "var(--color-bg-secondary)",
              borderColor: "var(--color-border)",
            }}
          >
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-lg">
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>

              {/* User info */}
              <div className="flex-1 min-w-0">
                <h3
                  className="font-semibold text-base truncate"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  {user.name}
                </h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <HiOutlineMail
                    className="w-3.5 h-3.5 flex-shrink-0"
                    style={{ color: "var(--color-text-muted)" }}
                  />
                  <span
                    className="text-sm truncate"
                    style={{ color: "var(--color-text-secondary)" }}
                  >
                    {user.email}
                  </span>
                </div>
              </div>
            </div>

            {/* Role badge */}
            <div className="mt-4 pt-3 border-t" style={{ borderColor: "var(--color-border)" }}>
              <span
                className={
                  "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium " +
                  (user.role === "admin"
                    ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                    : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400")
                }
              >
                {user.role === "admin" ? (
                  <HiOutlineShieldCheck className="w-3.5 h-3.5" />
                ) : (
                  <HiOutlineUser className="w-3.5 h-3.5" />
                )}
                {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div
          className="text-center py-16 rounded-xl border"
          style={{
            backgroundColor: "var(--color-bg-secondary)",
            borderColor: "var(--color-border)",
          }}
        >
          <p style={{ color: "var(--color-text-muted)" }}>
            No team members found
          </p>
        </div>
      )}
    </div>
  );
};

export default Team;
