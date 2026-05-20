// src/components/LoadingSpinner.jsx
// Reusable loading spinner component

const LoadingSpinner = ({ size = "md", text = "Loading..." }) => {
  // Size variants for the spinner
  const sizes = {
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div
        className={
          sizes[size] +
          " border-3 border-indigo-200 border-t-indigo-500 rounded-full animate-spin"
        }
      />
      {text && (
        <p
          className="mt-3 text-sm"
          style={{ color: "var(--color-text-secondary)" }}
        >
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
