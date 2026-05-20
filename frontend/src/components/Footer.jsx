// src/components/Footer.jsx
// Footer component with rectangular styling

const Footer = () => {
  return (
    <footer
      className="border-t py-6 px-6 mt-auto flex flex-col md:flex-row items-center justify-between transition-colors duration-300"
      style={{
        backgroundColor: "var(--color-bg-primary)",
        borderColor: "var(--color-border)",
        color: "var(--color-text-secondary)",
      }}
    >
      <div className="flex items-center gap-2 mb-4 md:mb-0">
        <div className="w-6 h-6 rounded-sm bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center">
          <span className="text-white font-bold text-[10px]">TF</span>
        </div>
        <span className="font-semibold text-sm" style={{ color: "var(--color-text-primary)" }}>
          TaskForge
        </span>
      </div>
      
      <div className="text-sm">
        &copy; {new Date().getFullYear()} TaskForge. All rights reserved.
      </div>
      
      <div className="flex gap-4 mt-4 md:mt-0 text-sm">
        <a href="#" className="hover:text-indigo-500 transition-colors">Terms</a>
        <a href="#" className="hover:text-indigo-500 transition-colors">Privacy</a>
        <a href="#" className="hover:text-indigo-500 transition-colors">Contact</a>
      </div>
    </footer>
  );
};

export default Footer;
