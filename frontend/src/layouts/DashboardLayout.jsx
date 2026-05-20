// src/layouts/DashboardLayout.jsx
// Main layout wrapper with header, content area, and footer

import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const DashboardLayout = () => {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "var(--color-bg-primary)" }}>
      {/* Top navigation header */}
      <Header />

      {/* Main content area */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 lg:p-8">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default DashboardLayout;
