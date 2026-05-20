// src/components/Sidebar.jsx
// Sidebar navigation component with links based on user role

import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  HiOutlineViewGrid,
  HiOutlineCollection,
  HiOutlineClipboardCheck,
  HiOutlineUserGroup,
  HiOutlineUser,
  HiOutlineLogout,
  HiOutlineClock,
  HiX,
} from "react-icons/hi";

const Sidebar = ({ isOpen, onClose }) => {
  const { user, isAdmin, logout } = useAuth();

  // Navigation links - some only visible to admins
  const navLinks = [
    {
      to: "/dashboard",
      label: "Dashboard",
      icon: HiOutlineViewGrid,
      roles: ["admin", "member"],
    },
    {
      to: "/projects",
      label: "Projects",
      icon: HiOutlineCollection,
      roles: ["admin", "member"],
    },
    {
      to: "/tasks",
      label: "Tasks",
      icon: HiOutlineClipboardCheck,
      roles: ["admin", "member"],
    },
    {
      to: "/team",
      label: "Team",
      icon: HiOutlineUserGroup,
      roles: ["admin"],
    },
    {
      to: "/activity",
      label: "Activity",
      icon: HiOutlineClock,
      roles: ["admin", "member"],
    },
    {
      to: "/profile",
      label: "Profile",
      icon: HiOutlineUser,
      roles: ["admin", "member"],
    },
  ];

  // Filter links based on user role
  const filteredLinks = navLinks.filter((link) =>
    link.roles.includes(user?.role)
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={
          "fixed top-0 left-0 z-50 h-full w-64 transition-transform duration-300 ease-in-out lg:translate-x-0 " +
          (isOpen ? "translate-x-0" : "-translate-x-full")
        }
        style={{
          backgroundColor: "var(--color-sidebar-bg)",
          color: "var(--color-sidebar-text)",
        }}
      >
        {/* Logo area */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center">
              <span className="text-white font-bold text-sm">TF</span>
            </div>
            <span className="text-white font-bold text-lg">TaskForge</span>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-white transition-colors"
          >
            <HiX className="w-5 h-5" />
          </button>
        </div>

        {/* User info */}
        <div className="px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {user?.name?.charAt(0)?.toUpperCase() || "U"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium truncate">
                {user?.name}
              </p>
              <p className="text-xs capitalize" style={{ color: "var(--color-sidebar-text)" }}>
                {user?.role}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation links */}
        <nav className="px-3 py-4 flex-1 overflow-y-auto">
          <ul className="space-y-1">
            {filteredLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 " +
                    (isActive
                      ? "bg-indigo-500/20 text-indigo-400"
                      : "hover:bg-white/5 text-gray-400 hover:text-white")
                  }
                >
                  <link.icon className="w-5 h-5 flex-shrink-0" />
                  <span>{link.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Logout button */}
        <div className="px-3 py-4 border-t border-white/10">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200"
          >
            <HiOutlineLogout className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
