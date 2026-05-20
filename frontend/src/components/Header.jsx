// src/components/Header.jsx
// Top header bar with search, dark mode toggle, and mobile menu button

import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { HiOutlineMenu, HiOutlineMoon, HiOutlineSun, HiOutlineBell } from "react-icons/hi";

const Header = ({ onMenuClick }) => {
  const { darkMode, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <header
      className="h-16 flex items-center justify-between px-4 lg:px-6 border-b"
      style={{
        backgroundColor: "var(--color-bg-secondary)",
        borderColor: "var(--color-border)",
      }}
    >
      {/* Left side - menu button and page context */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          style={{ color: "var(--color-text-primary)" }}
        >
          <HiOutlineMenu className="w-5 h-5" />
        </button>
        <div>
          <p
            className="text-sm"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Welcome back,
          </p>
          <p
            className="text-base font-semibold"
            style={{ color: "var(--color-text-primary)" }}
          >
            {user?.name || "User"}
          </p>
        </div>
      </div>

      {/* Right side - actions */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <button
          className="p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          style={{ color: "var(--color-text-secondary)" }}
        >
          <HiOutlineBell className="w-5 h-5" />
        </button>

        {/* Dark mode toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          style={{ color: "var(--color-text-secondary)" }}
          title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? (
            <HiOutlineSun className="w-5 h-5 text-yellow-400" />
          ) : (
            <HiOutlineMoon className="w-5 h-5" />
          )}
        </button>

        {/* User avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center ml-2 cursor-pointer">
          <span className="text-white font-semibold text-xs">
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
