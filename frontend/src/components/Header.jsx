// src/components/Header.jsx
// Top header bar with navigation, dark mode toggle, and mobile menu

import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { HiOutlineMenu, HiOutlineMoon, HiOutlineSun, HiOutlineLogout, HiX } from "react-icons/hi";

const Header = () => {
  const { darkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: "/dashboard", label: "Dashboard", roles: ["admin", "member"] },
    { to: "/projects", label: "Projects", roles: ["admin", "member"] },
    { to: "/tasks", label: "Tasks", roles: ["admin", "member"] },
    { to: "/team", label: "Team", roles: ["admin"] },
    { to: "/activity", label: "Activity", roles: ["admin", "member"] },
    { to: "/profile", label: "Profile", roles: ["admin", "member"] },
  ];

  const filteredLinks = navLinks.filter((link) => link.roles.includes(user?.role));

  return (
    <header
      className="h-16 flex items-center justify-between px-4 lg:px-8 border-b relative"
      style={{
        backgroundColor: "var(--color-bg-secondary)",
        borderColor: "var(--color-border)",
      }}
    >
      {/* Brand */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-sm bg-indigo-500 flex items-center justify-center">
          <span className="text-white font-bold text-sm">TF</span>
        </div>
        <span className="font-bold text-lg hidden sm:block" style={{ color: "var(--color-text-primary)" }}>
          TaskForge
        </span>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center gap-6">
        {filteredLinks.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              "text-sm font-medium transition-colors border-b-2 py-5 " +
              (isActive
                ? "border-indigo-500 text-indigo-500"
                : "border-transparent text-gray-500 hover:text-indigo-500 dark:text-gray-400 dark:hover:text-indigo-400")
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* Right Actions */}
      <div className="flex items-center gap-3">
        {/* Dark mode toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          style={{ color: "var(--color-text-secondary)" }}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? (
            <HiOutlineSun className="w-5 h-5 text-yellow-400" />
          ) : (
            <HiOutlineMoon className="w-5 h-5" />
          )}
        </button>

        {/* User avatar & Logout */}
        <div className="hidden sm:flex items-center gap-3 ml-2 pl-4 border-l" style={{ borderColor: "var(--color-border)" }}>
          <div className="w-8 h-8 rounded-sm bg-indigo-500 flex items-center justify-center" title={user?.name}>
            <span className="text-white font-semibold text-xs">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </span>
          </div>
          <button
            onClick={logout}
            className="text-sm font-medium text-gray-500 hover:text-red-500 transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-sm hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          style={{ color: "var(--color-text-primary)" }}
        >
          {mobileMenuOpen ? <HiX className="w-5 h-5" /> : <HiOutlineMenu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Navigation Dropdown */}
      {mobileMenuOpen && (
        <div 
          className="absolute top-16 left-0 w-full border-b shadow-sm lg:hidden z-50 p-4 flex flex-col gap-4"
          style={{
            backgroundColor: "var(--color-bg-secondary)",
            borderColor: "var(--color-border)",
          }}
        >
          <nav className="flex flex-col gap-3">
            {filteredLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  "block px-3 py-2 text-sm font-medium border-l-2 " +
                  (isActive
                    ? "border-indigo-500 text-indigo-500 bg-indigo-500/5"
                    : "border-transparent text-gray-500 hover:text-indigo-500 dark:text-gray-400 dark:hover:text-indigo-400")
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          
          <div className="pt-3 border-t flex items-center justify-between" style={{ borderColor: "var(--color-border)" }}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-sm bg-indigo-500 flex items-center justify-center">
                <span className="text-white font-semibold text-xs">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
              <span className="text-sm font-medium" style={{ color: "var(--color-text-primary)" }}>{user?.name}</span>
            </div>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                logout();
              }}
              className="flex items-center gap-1 text-sm font-medium text-red-500"
            >
              <HiOutlineLogout className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
