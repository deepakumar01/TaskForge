// src/pages/Profile.jsx
// User profile page with editable details

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlineShieldCheck,
  HiOutlineCalendar,
} from "react-icons/hi";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  // Handle profile update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(formData);
      toast.success("Profile updated successfully");
      setEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      {/* Page header */}
      <div className="mb-6">
        <h1
          className="text-2xl font-bold"
          style={{ color: "var(--color-text-primary)" }}
        >
          Profile
        </h1>
        <p
          className="text-sm mt-1"
          style={{ color: "var(--color-text-secondary)" }}
        >
          Manage your account settings
        </p>
      </div>

      {/* Profile card */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{
          backgroundColor: "var(--color-bg-secondary)",
          borderColor: "var(--color-border)",
        }}
      >
        {/* Banner */}
        <div className="h-32 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-500 relative">
          <div className="absolute -bottom-12 left-6">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center border-4 shadow-lg"
              style={{ borderColor: "var(--color-bg-secondary)" }}
            >
              <span className="text-white font-bold text-3xl">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
          </div>
        </div>

        {/* Profile info */}
        <div className="pt-16 px-6 pb-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2
                className="text-xl font-bold"
                style={{ color: "var(--color-text-primary)" }}
              >
                {user?.name}
              </h2>
              <span
                className={
                  "inline-flex items-center gap-1.5 mt-1 px-3 py-0.5 rounded-full text-xs font-medium " +
                  (user?.role === "admin"
                    ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400"
                    : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400")
                }
              >
                <HiOutlineShieldCheck className="w-3.5 h-3.5" />
                {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
              </span>
            </div>
            {!editing && (
              <button
                onClick={() => setEditing(true)}
                className="px-4 py-2 rounded-xl border text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                style={{
                  borderColor: "var(--color-border)",
                  color: "var(--color-text-primary)",
                }}
              >
                Edit Profile
              </button>
            )}
          </div>

          {editing ? (
            /* Edit form */
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  Full Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  style={{
                    backgroundColor: "var(--color-bg-tertiary)",
                    borderColor: "var(--color-border)",
                    color: "var(--color-text-primary)",
                  }}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: "var(--color-text-primary)" }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  className="w-full px-4 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  style={{
                    backgroundColor: "var(--color-bg-tertiary)",
                    borderColor: "var(--color-border)",
                    color: "var(--color-text-primary)",
                  }}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setFormData({ name: user?.name || "", email: user?.email || "" });
                  }}
                  className="px-4 py-2 rounded-xl text-sm font-medium"
                  style={{ color: "var(--color-text-secondary)" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium hover:from-indigo-600 hover:to-purple-700 transition-all disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          ) : (
            /* Display info */
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: "var(--color-bg-tertiary)" }}>
                <HiOutlineMail className="w-5 h-5 text-indigo-500" />
                <div>
                  <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                    Email
                  </p>
                  <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                    {user?.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: "var(--color-bg-tertiary)" }}>
                <HiOutlineUser className="w-5 h-5 text-indigo-500" />
                <div>
                  <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                    Role
                  </p>
                  <p className="text-sm font-medium capitalize" style={{ color: "var(--color-text-primary)" }}>
                    {user?.role}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor: "var(--color-bg-tertiary)" }}>
                <HiOutlineCalendar className="w-5 h-5 text-indigo-500" />
                <div>
                  <p className="text-xs" style={{ color: "var(--color-text-muted)" }}>
                    Member Since
                  </p>
                  <p className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>
                    {formatDate(user?.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
